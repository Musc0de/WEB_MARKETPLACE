import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, notifications, orders, shipmentEvents, shipments } from '@starsuperscare/database';

const app = new Hono();

const WebhookSchema = z.object({
  trackingNumber: z.string(),
  eventId: z.string(),
  status: z.enum(['in_transit', 'out_for_delivery', 'delivered', 'failed']),
  location: z.string().optional(),
  description: z.string(),
  timestamp: z.string(), // ISO string
});

app.post('/:courier', zValidator('json', WebhookSchema), async (c) => {
  const { courier } = c.req.param();
  const payload = c.req.valid('json');

  // VERY BASIC auth for webhook endpoint in a real scenario
  // e.g., checking a shared secret header from the courier.
  const signature = c.req.header('x-courier-signature');
  if (
    Deno.env.get('COURIER_WEBHOOK_SECRET') && signature !== Deno.env.get('COURIER_WEBHOOK_SECRET')
  ) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid signature' } }, 401);
  }

  try {
    await db.transaction(async (tx) => {
      // Find shipment
      const [shipment] = await tx
        .select()
        .from(shipments)
        .where(eq(shipments.trackingNumber, payload.trackingNumber));

      if (!shipment || shipment.carrier !== courier) {
        return; // Ignore silently to avoid leaking shipment existence
      }

      // Idempotency check via externalEventId unique constraint handling,
      // but let's check it manually just to be safe and avoid throwing constraint error
      const [existingEvent] = await tx
        .select({ id: shipmentEvents.id })
        .from(shipmentEvents)
        .where(eq(shipmentEvents.externalEventId, payload.eventId));

      if (existingEvent) {
        return; // Already processed
      }

      // Insert event
      await tx.insert(shipmentEvents).values({
        shipmentId: shipment.id,
        externalEventId: payload.eventId,
        status: payload.status,
        location: payload.location || null,
        description: payload.description,
        eventTime: payload.timestamp,
      });

      // Update shipment status if needed (very simplistic status hierarchy)
      if (shipment.status !== 'delivered' && shipment.status !== 'failed') {
        await tx.update(shipments)
          .set({ status: payload.status, updatedAt: new Date().toISOString() })
          .where(eq(shipments.id, shipment.id));

        // If delivered, update order status and send notification
        if (payload.status === 'delivered') {
          await tx.update(orders)
            .set({ status: 'delivered', updatedAt: new Date().toISOString() })
            .where(eq(orders.id, shipment.orderId));

          const [order] = await tx.select({ userId: orders.userId }).from(orders).where(
            eq(orders.id, shipment.orderId),
          );

          if (order.userId) {
            await tx.insert(notifications).values({
              userId: order.userId,
              type: 'order_delivered',
              title: 'Your order has been delivered!',
              body: 'Your shipment has reached its destination.',
              dataJson: { orderId: shipment.orderId },
            });
          }
        }
      }
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to process webhook' } }, 500);
  }
});

export default app;
