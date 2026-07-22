import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@starsuperscare/database';
import {
  globalSettings,
  idempotencyKeys,
  orderAddresses,
  orders,
  payments,
  userProfiles,
} from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { PaymentIntentRequestSchema } from '@starsuperscare/contracts';
import {
  louvinPaymentProvider,
  PaymentProvider,
  paymentProvider,
  saweriaPaymentProvider,
} from './provider.ts';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

export const paymentsRouter = new Hono<AppContext>();

// In-memory lock to prevent race conditions (e.g. React Strict Mode double fetch)
const intentLocks = new Map<string, Promise<any>>();

paymentsRouter.post('/intent', zValidator('json', PaymentIntentRequestSchema), async (c) => {
  // --- ANTI-BOT & HEADERS VALIDATION ---
  const idempotencyKey = c.req.header('Idempotency-Key');
  const requestedWith = c.req.header('X-Requested-With');
  const tokenAuth = c.req.header('TOKEN_AUTH_MERCHANTS');
  const botAuth = c.req.header('AUTH_PAYMENT_BOT');

  const EXPECTED_TOKEN_AUTH = typeof process !== 'undefined'
    ? (process.env['MERCHANT_TOKEN'] || '')
    : '';
  const EXPECTED_BOT_AUTH = typeof process !== 'undefined'
    ? (process.env['BOT_PROTECTION_KEY'] || '')
    : '';

  if (
    !idempotencyKey || requestedWith !== 'XMLHttpRequest' || tokenAuth !== EXPECTED_TOKEN_AUTH ||
    botAuth !== EXPECTED_BOT_AUTH
  ) {
    return c.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Request rejected you are bot .',
      },
    }, 403);
  }

  // --- IDEMPOTENCY CHECK ---
  const existingKeyList = await db.select().from(idempotencyKeys).where(
    eq(idempotencyKeys.key, idempotencyKey),
  ).limit(1);
  if (existingKeyList.length > 0) {
    const cachedResponse = existingKeyList[0].response;
    if (cachedResponse) {
      console.log(`[Idempotency] Returning cached response for key: ${idempotencyKey}`);
      return c.json(cachedResponse as any);
    }
  }

  const { orderId, paymentType } = c.req.valid('json');
  console.log(`[Payment] Processing intent for order: ${orderId} with key: ${idempotencyKey}`);

  // Wait if another request for this order is currently processing
  if (intentLocks.has(orderId)) {
    await intentLocks.get(orderId);
  }

  let resolveLock: (value?: any) => void;
  intentLocks.set(
    orderId,
    new Promise((resolve) => {
      resolveLock = resolve;
    }),
  );

  try {
    // Determine active payment gateway
    const [settings] = await db.select().from(globalSettings).where(
      eq(globalSettings.id, 'global'),
    ).limit(1);
    const activeGateway = settings?.activePaymentGateway || '';

    // Explicitly type as PaymentProvider to resolve union return type issues
    const provider: PaymentProvider = activeGateway === 'louvin'
      ? louvinPaymentProvider
      : activeGateway === 'saweria'
      ? saweriaPaymentProvider
      : paymentProvider;

    // Check if order exists
    const orderList = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (orderList.length === 0) {
      return c.json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    }
    const order = orderList[0];

    if (order.status !== 'pending') {
      return c.json({
        error: { code: 'BAD_REQUEST', message: `Order status is ${order.status}, cannot pay` },
      });
    }

    // Check if there's already a payment for this order
    const existingPaymentList = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId))
      .limit(1);

    // If order is already paid, reject
    if (existingPaymentList.length > 0 && existingPaymentList[0].status === 'success') {
      return c.json({ error: { code: 'BAD_REQUEST', message: 'Order already paid' } });
    }

    // If a pending payment already exists, REUSE it (idempotent).
    // This prevents duplicate key violations on re-requesting an intent for the same order.
    if (existingPaymentList.length > 0 && existingPaymentList[0].status === 'pending') {
      const existing = existingPaymentList[0];

      // Force recreate if it's Saweria but it's using the old format (no isSaweria flag)
      const isOldSaweriaFormat = activeGateway === 'saweria' &&
        (!(existing.instructionPayload as any)?.isSaweria ||
          !(existing.instructionPayload as any)?.qrString);

      if (!isOldSaweriaFormat) {
        const reuseResponse = {
          data: {
            paymentId: existing.id,
            providerTransactionId: existing.providerTransactionId,
            clientSecret: activeGateway === 'sandbox'
              ? `sec_${existing.providerTransactionId?.replace('txn_', '')}`
              : undefined,
            instructionPayload: existing.instructionPayload,
            expiresAt: existing.expiresAt,
            amount: existing.customerPaymentAmount || order.totalAmount,
            currency: 'IDR',
            status: 'pending',
          },
          meta: { request_id: c.get('requestId') },
          error: null,
        };

        // Cache the reused response
        try {
          await db.insert(idempotencyKeys).values({
            key: idempotencyKey,
            action: 'reuse_intent',
            response: reuseResponse,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (e) {
          console.warn(`[Idempotency] Failed to store key ${idempotencyKey}`, e);
        }

        return c.json(reuseResponse);
      } else {
        // Delete the old invalid format so we can generate a new one
        await db.delete(payments).where(eq(payments.id, existing.id));
      }
    }

    // Fetch customer address if available
    const addressList = await db.select().from(orderAddresses).where(
      eq(orderAddresses.orderId, order.id),
    ).limit(1);
    let customerName = '';

    if (addressList.length > 0) {
      const shipping = addressList[0].shippingSnapshot as any;
      if (shipping?.fullName) {
        customerName = shipping.fullName;
      }
    }

    // If no name from address, check user profile if they are logged in
    if (!customerName && order.userId) {
      const profileList = await db.select().from(userProfiles).where(
        eq(userProfiles.userId, order.userId),
      ).limit(1);
      if (profileList.length > 0 && profileList[0].fullName) {
        customerName = profileList[0].fullName;
      }
    }

    // If STILL no name (guest digital checkout), extract from email
    if (!customerName && order.emailSnapshot) {
      const emailName = order.emailSnapshot.split('@')[0];
      customerName = emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase();
    }

    if (!customerName) {
      throw new Error('Unable to determine customer name from order or profile data.');
    }

    // Generate new intent for this order
    const intent = await provider.createIntent(order.id, order.totalAmount, paymentType, {
      name: customerName,
      email: order.emailSnapshot,
    });

    // Insert the new payment record
    const inserted = await db.insert(payments).values({
      orderId: order.id,
      provider: activeGateway,
      providerTransactionId: intent.providerTransactionId,
      amount: order.totalAmount,
      status: 'pending',
      paymentType: paymentType,
      customerPaymentAmount: intent.customerPaymentAmount,
      gatewayFee: intent.gatewayFee,
      instructionPayload: intent.instructionPayload,
      expiresAt: intent.expiresAt ? new Date(intent.expiresAt).toISOString() : null,
    }).returning({ id: payments.id });

    const paymentId = inserted[0].id;

    const finalResponse = {
      data: {
        paymentId,
        providerTransactionId: intent.providerTransactionId,
        clientSecret: intent.clientSecret,
        instructionPayload: intent.instructionPayload,
        expiresAt: intent.expiresAt,
        amount: intent.customerPaymentAmount || order.totalAmount,
        currency: 'IDR',
        status: 'pending',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    };

    // Cache the response using the Idempotency-Key
    try {
      await db.insert(idempotencyKeys).values({
        key: idempotencyKey,
        action: 'create_intent',
        response: finalResponse,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours expiry
      });
    } catch (e) {
      console.warn(`[Idempotency] Failed to store key ${idempotencyKey}`, e);
    }

    return c.json(finalResponse);
  } finally {
    if (resolveLock!) resolveLock();
    intentLocks.delete(orderId);
  }
});

paymentsRouter.get('/:id/status', async (c) => {
  const paymentId = c.req.param('id');
  const paymentList = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (paymentList.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Payment not found' } }, 404);
  }
  return c.json({
    data: { status: paymentList[0].status },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

paymentsRouter.post('/simulate', async (c) => {
  // ONLY for testing sandbox. Never do this in production.
  const payload = await c.req.json();
  const payloadString = JSON.stringify(payload);
  const signature = paymentProvider.generateSignature(payloadString);

  // Directly call the webhook locally
  const apiUrl = typeof process !== 'undefined' ? (process.env.VITE_API_URL || '') : '';
  const response = await fetch(`${apiUrl}/v1/webhooks/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature,
    },
    body: payloadString,
  });

  const resJson = await response.json();
  return c.json(resJson, response.status as any);
});
