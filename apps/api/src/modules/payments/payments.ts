import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@starsuperscare/database';
import { orders, payments } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { PaymentIntentRequestSchema } from '@starsuperscare/contracts';
import { paymentProvider } from './provider.ts';
type AppContext = {
  Variables: {
    requestId: string;
  };
};

export const paymentsRouter = new Hono<AppContext>();

paymentsRouter.post('/intent', zValidator('json', PaymentIntentRequestSchema), async (c) => {
  const { orderId } = c.req.valid('json');

  // Check if order exists
  const orderList = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (orderList.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Order not found' } }, 404);
  }
  const order = orderList[0];

  if (order.status !== 'pending') {
    return c.json({
      error: { code: 'BAD_REQUEST', message: `Order status is ${order.status}, cannot pay` },
    }, 400);
  }

  // Check if there's already a pending payment for this order
  const existingPaymentList = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .limit(1);

  if (existingPaymentList.length > 0 && existingPaymentList[0].status === 'success') {
    return c.json({ error: { code: 'BAD_REQUEST', message: 'Order already paid' } }, 400);
  }

  const intent = await paymentProvider.createIntent(order.id, order.totalAmount);

  let paymentId = '';

  if (existingPaymentList.length > 0) {
    paymentId = existingPaymentList[0].id;
    // Update existing
    await db.update(payments).set({
      providerTransactionId: intent.providerTransactionId,
      amount: order.totalAmount,
      updatedAt: new Date().toISOString(),
    }).where(eq(payments.id, paymentId));
  } else {
    // Create new
    const inserted = await db.insert(payments).values({
      orderId: order.id,
      provider: 'sandbox',
      providerTransactionId: intent.providerTransactionId,
      amount: order.totalAmount,
      status: 'pending',
    }).returning({ id: payments.id });
    paymentId = inserted[0].id;
  }

  return c.json({
    data: {
      paymentId,
      providerTransactionId: intent.providerTransactionId,
      clientSecret: intent.clientSecret,
      amount: order.totalAmount,
      currency: 'IDR',
      status: 'pending',
    },
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
  const response = await fetch('http://localhost:8000/v1/webhooks/payments', {
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
