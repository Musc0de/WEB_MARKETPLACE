import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import {
  db,
  notifications,
  orders,
  orderStatusHistory,
  shipmentEvents,
  shipments,
} from '@starsuperscare/database';

const app = new Hono();

app.post('/:courier', async (c) => {
  let payload: any = {};
  try {
    const text = await c.req.text();
    if (text) {
      payload = JSON.parse(text);
    }
  } catch (_e) {
    // Ignore JSON parse errors for empty bodies
  }

  // Biteship verification ping sends empty body. We must return 200 OK.
  if (Object.keys(payload).length === 0 || payload.event === 'ping') {
    return c.json({ success: true, message: 'Webhook verified' }, 200);
  }

  // Signature Validation (Biteship Dashboard: Headers Signature Key)
  const signatureKey = process.env.COURIER_WEBHOOK_HEADER || 'x-biteship-signature';
  const signature = c.req.header(signatureKey);
  const secret = process.env.COURIER_WEBHOOK_SECRET;

  if (secret && signature !== secret) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid signature' } }, 401);
  }

  try {
    await db.transaction(async (tx) => {
      // 1. ORDER.WAYBILL_ID EVENT
      if (payload.event === 'order.waybill_id') {
        const orderId = payload.order_id;
        const tracking = payload.courier_waybill_id || payload.courier_tracking_id;

        // Update shipments trackingNumber where trackingNumber was Biteship Order ID
        const [shipment] = await tx.select().from(shipments).where(
          eq(shipments.trackingNumber, orderId),
        ).limit(1);
        if (shipment) {
          await tx.update(shipments).set({
            trackingNumber: tracking,
            updatedAt: new Date().toISOString(),
          }).where(eq(shipments.id, shipment.id));
        }
      } // 2. ORDER.STATUS EVENT
      else if (payload.event === 'order.status') {
        const trackingId = payload.courier_waybill_id || payload.courier_tracking_id ||
          payload.order_id;
        let [shipment] = await tx.select().from(shipments).where(
          eq(shipments.trackingNumber, trackingId),
        ).limit(1);

        // Fallback: If waybill hasn't synced yet, try to find by Biteship order_id
        if (!shipment && payload.order_id) {
          [shipment] = await tx.select().from(shipments).where(
            eq(shipments.trackingNumber, payload.order_id),
          ).limit(1);
        }

        if (shipment) {
          const statusMap: Record<string, string> = {
            'confirmed': 'processing',
            'allocated': 'processing',
            'picking_up': 'processing',
            'picked': 'shipped',
            'dropping_off': 'in_transit',
            'delivered': 'delivered',
            'rejected': 'failed',
            'cancelled': 'cancelled',
          };

          const mappedStatus = statusMap[payload.status] || 'in_transit';

          await tx.insert(shipmentEvents).values({
            shipmentId: shipment.id,
            externalEventId: `${payload.event}_${payload.status}_${Date.now()}`,
            status: payload.status,
            description: `Driver: ${payload.courier_driver_name || '-'} | Phone: ${
              payload.courier_driver_phone || '-'
            }`,
            eventTime: new Date().toISOString(),
          });

          await tx.update(shipments).set({
            status: mappedStatus,
            updatedAt: new Date().toISOString(),
          }).where(eq(shipments.id, shipment.id));

          if (mappedStatus !== 'in_transit' && mappedStatus !== 'processing') {
            await tx.update(orders).set({
              status: mappedStatus,
              updatedAt: new Date().toISOString(),
            }).where(eq(orders.id, shipment.orderId));

            await tx.insert(orderStatusHistory).values({
              orderId: shipment.orderId,
              status: mappedStatus,
              note: `Status resi: ${payload.status} (via Biteship)`,
            });

            if (mappedStatus === 'delivered') {
              const [order] = await tx.select({ userId: orders.userId }).from(orders).where(
                eq(orders.id, shipment.orderId),
              );
              if (order.userId) {
                await tx.insert(notifications).values({
                  userId: order.userId,
                  type: 'order_delivered',
                  title: 'Paket telah sampai!',
                  body: 'Pesanan Anda telah berhasil dikirimkan oleh kurir.',
                  dataJson: { orderId: shipment.orderId },
                });
              }
            }
          }
        }
      } // 3. ORDER.PRICE EVENT
      else if (payload.event === 'order.price') {
        // Find order by trackingNumber which holds order_id initially
        const [shipment] = await tx.select().from(shipments).where(
          eq(shipments.trackingNumber, payload.order_id),
        ).limit(1);
        if (shipment) {
          const [order] = await tx.select().from(orders).where(eq(orders.id, shipment.orderId))
            .limit(1);
          if (order) {
            await tx.update(orders).set({
              shippingAmount: payload.price,
              totalAmount: order.subtotalAmount + payload.price - order.discountAmount +
                order.taxAmount + order.serviceFeeAmount,
              updatedAt: new Date().toISOString(),
            }).where(eq(orders.id, order.id));

            await tx.insert(orderStatusHistory).values({
              orderId: order.id,
              status: order.status,
              note: `Perubahan ongkir aktual dari kurir: Rp${payload.price}`,
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
