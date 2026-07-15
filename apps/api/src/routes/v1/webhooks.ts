import { Hono } from 'hono';
import { db } from '@starsuperscare/database';
import {
  inventoryLevels,
  orderItems,
  orders,
  orderStatusHistory,
  outboxEvents,
  paymentEvents,
  payments,
} from '@starsuperscare/database';
import { eq, sql } from 'drizzle-orm';
import { WebhookPayloadSchema } from '@starsuperscare/contracts';
import { paymentProvider } from '../../modules/payments/provider.ts';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

export const webhooksRouter = new Hono<AppContext>();

webhooksRouter.post('/', async (c) => {
  // Read body as text for signature verification
  const payloadText = await c.req.text();
  const signature = c.req.header('X-Signature');

  if (!signature) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing signature' } }, 401);
  }

  try {
    paymentProvider.verifyWebhookSignature(payloadText, signature);
  } catch (err: any) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: err.message } }, 401);
  }

  // Parse payload
  let payload: any;
  try {
    payload = JSON.parse(payloadText);
  } catch {
    return c.json({ error: { code: 'BAD_REQUEST', message: 'Invalid JSON payload' } }, 400);
  }

  const parsed = WebhookPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return c.json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid webhook schema',
        details: parsed.error.issues,
      },
    }, 400);
  }

  const data = parsed.data;

  // Idempotency check: see if event already processed
  const existingEvent = await db.select().from(paymentEvents).where(
    eq(paymentEvents.providerEventId, data.providerEventId),
  ).limit(1);
  if (existingEvent.length > 0) {
    // Duplicate webhook, return success but don't process again
    return c.json({
      data: { status: 'ignored_duplicate' },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  }

  const paymentList = await db.select().from(payments).where(
    eq(payments.providerTransactionId, data.data.providerTransactionId),
  ).limit(1);

  if (paymentList.length === 0) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Payment not found' } }, 404);
  }

  const payment = paymentList[0];

  // Process event in a transaction
  await db.transaction(async (tx) => {
    // 1. Record event
    await tx.insert(paymentEvents).values({
      paymentId: payment.id,
      providerEventId: data.providerEventId,
      eventType: data.type,
      payload: data.data,
    });

    if (data.type === 'payment_success' && payment.status === 'pending') {
      // Update payment
      await tx.update(payments).set({
        status: 'success',
        updatedAt: new Date().toISOString(),
      }).where(eq(payments.id, payment.id));

      // Update order status to 'paid' first
      await tx.update(orders).set({
        status: 'paid',
        updatedAt: new Date().toISOString(),
      }).where(eq(orders.id, payment.orderId));

      // Record 'paid' in order history
      await tx.insert(orderStatusHistory).values({
        orderId: payment.orderId,
        status: 'paid',
        note: 'Payment received via webhook',
      });

      // ── AUTO-TRANSITION: paid → processing ──────────────────────────────
      // Immediately advance to 'processing' so admin sees order ready to fulfill
      await tx.update(orders).set({
        status: 'processing',
        updatedAt: new Date().toISOString(),
      }).where(eq(orders.id, payment.orderId));

      await tx.insert(orderStatusHistory).values({
        orderId: payment.orderId,
        status: 'processing',
        note: 'Auto-advanced to processing after payment confirmed',
      });
      // ────────────────────────────────────────────────────────────────────

      // Fetch full order for outbox payload
      const orderList = await tx.select().from(orders).where(eq(orders.id, payment.orderId)).limit(
        1,
      );
      const fullOrder = orderList[0];

      // Insert into outbox for downstream services (email, worker)
      await tx.insert(outboxEvents).values({
        type: 'order.paid',
        payload: { order: fullOrder },
      });

      // Fulfillment of reservation
      const items = await tx.select().from(orderItems).where(
        eq(orderItems.orderId, payment.orderId),
      );
      for (const item of items) {
        await tx.update(inventoryLevels)
          .set({ reserved: sql`${inventoryLevels.reserved} - ${item.quantity}` })
          .where(eq(inventoryLevels.variantId, item.variantId));
      }
    } else if (data.type === 'payment_failed' && payment.status === 'pending') {
      await tx.update(payments).set({
        status: 'failed',
        updatedAt: new Date().toISOString(),
      }).where(eq(payments.id, payment.id));

      // Order status updated to cancelled
      await tx.update(orders).set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      }).where(eq(orders.id, payment.orderId));

      await tx.insert(orderStatusHistory).values({
        orderId: payment.orderId,
        status: 'cancelled',
        note: 'Payment failed via webhook',
      });

      // Release reservation (add back to available)
      const items = await tx.select().from(orderItems).where(
        eq(orderItems.orderId, payment.orderId),
      );
      for (const item of items) {
        await tx.update(inventoryLevels)
          .set({
            available: sql`${inventoryLevels.available} + ${item.quantity}`,
            reserved: sql`${inventoryLevels.reserved} - ${item.quantity}`,
          })
          .where(eq(inventoryLevels.variantId, item.variantId));
      }
    }
  });

  return c.json({
    data: { status: 'processed' },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});
