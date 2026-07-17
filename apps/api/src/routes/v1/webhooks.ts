import { Hono } from 'hono';
import { db } from '@starsuperscare/database';
import {
  digitalCredentials,
  inventoryLevels,
  inventoryMovements,
  orderItems,
  orders,
  orderStatusHistory,
  outboxEvents,
  paymentEvents,
  payments,
  products,
} from '@starsuperscare/database';
import { and, eq, sql } from 'drizzle-orm';
import { WebhookPayloadSchema } from '@starsuperscare/contracts';
import { louvinPaymentProvider, paymentProvider } from '../../modules/payments/provider.ts';

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

  if (signature) {
    try {
      paymentProvider.verifyWebhookSignature(payloadText, signature);
    } catch (err: any) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: err.message } }, 401);
    }
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

  // If this is a Louvin payment, we MUST verify the status directly
  if (payment.provider === 'louvin') {
    try {
      if (!louvinPaymentProvider.checkTransactionStatus) {
        throw new Error('Louvin checkTransactionStatus not implemented');
      }
      const verifiedStatus = await louvinPaymentProvider.checkTransactionStatus(
        payment.providerTransactionId as string,
      );

      // Override the data type based on the real status from Louvin to prevent spoofing
      if (verifiedStatus === 'settled') {
        data.type = 'payment_success';
      } else if (verifiedStatus === 'failed') {
        data.type = 'payment_failed';
      } else if (verifiedStatus === 'expired') {
        data.type = 'payment_expired';
      } else {
        return c.json({ data: { status: 'ignored_unsettled' } });
      }
    } catch (e: any) {
      return c.json({
        error: { code: 'UNAUTHORIZED', message: 'Louvin verification failed: ' + e.message },
      }, 401);
    }
  } else if (!signature) {
    // If it's a sandbox payment but there is no signature, reject
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing signature' } }, 401);
  }

  // Process event in a transaction
  await db.transaction(async (tx) => {
    // 1. Record event
    await tx.insert(paymentEvents).values({
      paymentId: payment.id,
      providerEventId: data.providerEventId,
      eventType: data.type,
      payload: data.data,
    });

    if (
      (data.type === 'payment_success' || data.type === 'payment.settled') &&
      payment.status === 'pending'
    ) {
      // Update payment
      await tx.update(payments).set({
        status: 'success',
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).where(eq(payments.id, payment.id));

      // Update order status to 'paid' first
      await tx.update(orders).set({
        status: 'paid',
        updatedAt: new Date().toISOString(),
      }).where(eq(orders.id, payment.orderId));

      const now = new Date();
      // Record 'paid' in order history
      await tx.insert(orderStatusHistory).values({
        orderId: payment.orderId,
        status: 'paid',
        note: 'Payment received via webhook',
        createdAt: now.toISOString(),
      });

      // ── AUTO-TRANSITION: paid → processing ──────────────────────────────
      // Immediately advance to 'processing' so admin sees order ready to fulfill
      await tx.update(orders).set({
        status: 'processing',
        updatedAt: new Date(now.getTime() + 100).toISOString(),
      }).where(eq(orders.id, payment.orderId));

      await tx.insert(orderStatusHistory).values({
        orderId: payment.orderId,
        status: 'processing',
        note: 'Auto-advanced to processing after payment confirmed',
        createdAt: new Date(now.getTime() + 100).toISOString(),
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
      const items = await tx.select({
        id: orderItems.id,
        productId: orderItems.productId,
        variantId: orderItems.variantId,
        quantity: orderItems.quantity,
        type: products.type,
      }).from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, payment.orderId));

      for (const item of items) {
        await tx.update(inventoryLevels)
          .set({ reserved: sql`${inventoryLevels.reserved} - ${item.quantity}` })
          .where(eq(inventoryLevels.variantId, item.variantId));

        if (item.type === 'digital' || item.type === 'service') {
          // Assign digital credentials if available
          const availableCreds = await tx.select()
            .from(digitalCredentials)
            .where(
              and(
                eq(digitalCredentials.productId, item.productId),
                eq(digitalCredentials.status, 'available'),
                // If variantId is specified in order, match it, or if it's null, ignore
              ),
            )
            .limit(item.quantity);

          if (availableCreds.length > 0) {
            const credIds = availableCreds.map((c) => c.id);
            await tx.update(digitalCredentials)
              .set({
                status: 'assigned',
                orderItemId: item.id,
                userId: fullOrder.userId,
                updatedAt: new Date().toISOString(),
              })
              .where(sql`${digitalCredentials.id} IN ${credIds}`);
          }
        }
      }
    } else if (
      (data.type === 'payment_failed' || data.type === 'payment.failed' ||
        data.type === 'payment_expired' || data.type === 'payment.expired') &&
      payment.status === 'pending'
    ) {
      const isExpired = data.type.includes('expired');
      const failureNote = isExpired ? 'Expired via webhook' : 'Failed via webhook';

      await tx.update(payments).set({
        status: isExpired ? 'expired' : 'failed',
        failureReason: failureNote,
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
        note: `Payment ${isExpired ? 'expired' : 'failed'} via webhook`,
      });

      // Release reservation (add back to available)
      const items = await tx.select({
        variantId: orderItems.variantId,
        quantity: orderItems.quantity,
        warehouseId: inventoryLevels.warehouseId,
      }).from(orderItems)
        .leftJoin(inventoryLevels, eq(orderItems.variantId, inventoryLevels.variantId))
        .where(eq(orderItems.orderId, payment.orderId));

      for (const item of items) {
        if (item.warehouseId) {
          await tx.update(inventoryLevels)
            .set({
              available: sql`${inventoryLevels.available} + ${item.quantity}`,
              reserved: sql`${inventoryLevels.reserved} - ${item.quantity}`,
            })
            .where(eq(inventoryLevels.variantId, item.variantId));

          await tx.insert(inventoryMovements).values({
            variantId: item.variantId,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
            type: 'release',
            note: `Payment ${isExpired ? 'expired' : 'failed'}`,
          });
        }
      }
    }
  });

  return c.json({
    data: { status: 'processed' },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});
