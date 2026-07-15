import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { db, orders, shipmentEvents, shipments, trackingTokens } from '@starsuperscare/database';

const app = new Hono();

async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

app.get('/:token', async (c) => {
  const { token } = c.req.param();

  if (!token) {
    return c.json({ error: { code: 'INVALID_REQUEST', message: 'Token is required' } }, 400);
  }

  const tokenHash = await hashToken(token);

  const [trackingRecord] = await db
    .select({
      id: trackingTokens.id,
      orderId: trackingTokens.orderId,
      expiresAt: trackingTokens.expiresAt,
      revokedAt: trackingTokens.revokedAt,
      orderStatus: orders.status,
    })
    .from(trackingTokens)
    .innerJoin(orders, eq(trackingTokens.orderId, orders.id))
    .where(eq(trackingTokens.tokenHash, tokenHash));

  if (!trackingRecord) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Tracking information not found' } }, 404);
  }

  if (trackingRecord.revokedAt || new Date(trackingRecord.expiresAt) < new Date()) {
    return c.json(
      { error: { code: 'FORBIDDEN', message: 'Tracking link expired or revoked' } },
      403,
    );
  }

  // Fetch shipment and events
  const [shipment] = await db
    .select({
      id: shipments.id,
      courier: shipments.carrier,
      trackingNumber: shipments.trackingNumber,
      status: shipments.status,
      estimatedDeliveryAt: shipments.deliveredAt, // Map deliveredAt for schema compatibility, though originally meant as estimate
    })
    .from(shipments)
    .where(eq(shipments.orderId, trackingRecord.orderId));

  let events: any[] = [];
  if (shipment) {
    events = await db
      .select({
        status: shipmentEvents.status,
        location: shipmentEvents.location,
        description: shipmentEvents.description,
        occurredAt: shipmentEvents.eventTime,
      })
      .from(shipmentEvents)
      .where(eq(shipmentEvents.shipmentId, shipment.id))
      .orderBy(desc(shipmentEvents.eventTime));
  }

  // Projection - strictly no PII (no address details, no user ID, no raw order ID)
  return c.json({
    data: {
      orderStatus: trackingRecord.orderStatus,
      shipment: shipment
        ? {
          courier: shipment.courier,
          trackingNumber: shipment.trackingNumber, // This is fine to show on a tracking page typically
          status: shipment.status,
          estimatedDeliveryAt: shipment.estimatedDeliveryAt,
          events,
        }
        : null,
    },
  }, 200);
});

export default app;
