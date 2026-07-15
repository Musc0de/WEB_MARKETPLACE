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

  let orderId: string | null = null;
  let orderStatus: string | null = null;
  let shipment: any = null;

  try {
    // 1. Try finding by secure tracking token
    const [tokenRecord] = await db
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

    if (tokenRecord) {
      if (tokenRecord.revokedAt || new Date(tokenRecord.expiresAt) < new Date()) {
        return c.json(
          { error: { code: 'FORBIDDEN', message: 'Tracking link expired or revoked' } },
          403,
        );
      }
      orderId = tokenRecord.orderId;
      orderStatus = tokenRecord.orderStatus;
    } else {
      // 2. Try finding by raw tracking number
      const [shipmentLookup] = await db
        .select({
          orderId: shipments.orderId,
          orderStatus: orders.status,
        })
        .from(shipments)
        .innerJoin(orders, eq(shipments.orderId, orders.id))
        .where(eq(shipments.trackingNumber, token))
        .orderBy(desc(shipments.createdAt))
        .limit(1);

      if (shipmentLookup) {
        orderId = shipmentLookup.orderId;
        orderStatus = shipmentLookup.orderStatus;
      }
    }

    if (orderId) {
      // Fetch shipment from DB
      const [dbShipment] = await db
        .select({
          id: shipments.id,
          courier: shipments.carrier,
          trackingNumber: shipments.trackingNumber,
          status: shipments.status,
          estimatedDeliveryAt: shipments.deliveredAt,
        })
        .from(shipments)
        .where(eq(shipments.orderId, orderId))
        .orderBy(desc(shipments.createdAt))
        .limit(1);
      shipment = dbShipment;
    }
  } catch (err: any) {
    // Ignore DB errors (e.g. missing tables) and fallback to external API
    console.warn('DB lookup for tracking failed, falling back to external API:', err.message);
  }

  const externalApiUrl = process.env.EXTERNAL_TRACKING_API_URL || Deno.env.get('EXTERNAL_TRACKING_API_URL');
  let events: any[] = [];

  let externalEvents = false;

  if (externalApiUrl && token) {
    const trackingNo = shipment ? shipment.trackingNumber : token;
    try {
      const res = await fetch(`${externalApiUrl}/${trackingNo}`);
      if (res.ok) {
        const apiData = await res.json();
        if (apiData.status === 200 && apiData.data?.valid) {
          const externalData = apiData.data.data;
          
          if (!shipment) {
             shipment = {
               courier: externalData.expedisi || 'Unknown',
               trackingNumber: trackingNo,
               status: externalData.status ? externalData.status.toLowerCase().replace(/\s+/g, '_') : 'unknown',
               estimatedDeliveryAt: null,
             };
             orderStatus = 'PENGIRIMAN_EKSTERNAL'; // Mock order status since it's external
          } else {
             if (externalData.status) {
               shipment.status = externalData.status.toLowerCase().replace(/\s+/g, '_');
             }
             if (externalData.expedisi) {
               shipment.courier = externalData.expedisi;
             }
          }

          if (externalData.perjalanan && Array.isArray(externalData.perjalanan)) {
            events = externalData.perjalanan.map((p: any, index: number) => {
              let eventDate = new Date();
              if (p.tanggal && p.tanggal !== '-') {
                const parsed = new Date(p.tanggal);
                if (!isNaN(parsed.getTime())) {
                  eventDate = parsed;
                }
              }
              return {
                status: index === 0 ? 'Update Terbaru' : 'Riwayat',
                location: externalData.tujuan || externalData.pengirim || '',
                description: p.keterangan || '',
                occurredAt: eventDate,
              };
            });
            externalEvents = true;
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch from external tracking API:', e);
    }
  }

  if (!shipment) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Tracking information not found' } }, 404);
  }

  if (orderId && !externalEvents && shipment.id) {
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
      orderStatus: orderStatus,
      shipment: {
        courier: shipment.courier,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        estimatedDeliveryAt: shipment.estimatedDeliveryAt,
        events: events,
      },
    },
  });
});

export default app;
