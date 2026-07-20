import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  adminAttachShipmentRequestSchema,
  adminUpdateOrderStatusRequestSchema,
} from '@starsuperscare/contracts';
import {
  db,
  inventoryLevels,
  inventoryMovements,
  orderAddresses,
  orderItems,
  orders,
  orderStatusHistory,
  productImages,
  products,
  productVariants,
  shipments,
  trackingTokens,
  userProfiles,
} from '@starsuperscare/database';
import { authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { sendNotification } from '../../notifications/index.ts';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

const adminOrdersRouter = new Hono();

// Require specific admin permission
adminOrdersRouter.use('/*', authMiddleware);
adminOrdersRouter.use('/*', requirePermission('orders.read'));

adminOrdersRouter.get(
  '/',
  zValidator(
    'query',
    z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('20'),
      status: z.string().optional(),
    }),
  ),
  async (c) => {
    const { page, limit, status } = c.req.valid('query');
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    const offset = (p - 1) * l;

    let whereClause = sql`1=1`;
    if (status) {
      whereClause = sql`${orders.status} = ${status}`;
    }

    const results = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      userId: orders.userId,
      customerEmail: orders.emailSnapshot,
      customerFirstName: userProfiles.fullName,
      customerLastName: sql<string | null>`NULL`,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
      .from(orders)
      .leftJoin(userProfiles, eq(orders.userId, userProfiles.userId))
      .where(whereClause)
      .limit(l)
      .offset(offset)
      .orderBy(desc(orders.createdAt));

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    // Per-status breakdown across ALL orders (not just current page/filter)
    const statusCountsRaw = await db.select({
      status: orders.status,
      count: sql<number>`count(*)`,
    })
      .from(orders)
      .groupBy(orders.status);

    const statusCounts = Object.fromEntries(
      statusCountsRaw.map((r) => [r.status, Number(r.count)]),
    );

    const formattedData = results.map((r) => ({
      id: r.id,
      orderNumber: r.orderNumber,
      userId: r.userId,
      customerName: r.customerFirstName || r.customerLastName
        ? `${r.customerFirstName || ''} ${r.customerLastName || ''}`.trim()
        : null,
      customerEmail: r.customerEmail,
      totalAmount: r.totalAmount,
      status: r.status as any,
      createdAt: r.createdAt,
    }));

    return c.json({
      data: formattedData,
      total,
      page: p,
      limit: l,
      statusCounts,
    });
  },
);

adminOrdersRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  const orderResult = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!orderResult.length) return c.json({ error: 'Order not found' }, 404);
  const order = orderResult[0];

  const rawItems = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      variantId: orderItems.variantId,
      quantity: orderItems.quantity,
      priceSnapshot: orderItems.priceSnapshot,
      productNameSnapshot: orderItems.productNameSnapshot,
      variantSkuSnapshot: orderItems.variantSkuSnapshot,
      productSlug: products.slug,
      comparePrice: productVariants.comparePrice,
      optionValues: productVariants.optionValues,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .where(eq(orderItems.orderId, id));

  // Fetch primary image for each unique product
  const uniqueProductIds = [...new Set(rawItems.map((i) => i.productId))];
  const r2Base = (typeof Deno !== 'undefined'
    ? Deno.env.get('R2_PUBLIC_URL')
    : process?.env?.['R2_PUBLIC_URL']) || '';
  const imageRows = uniqueProductIds.length > 0
    ? await db
      .select({
        productId: productImages.productId,
        objectKey: productImages.objectKey,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(inArray(productImages.productId, uniqueProductIds))
    : [];

  const imageMap: Record<string, string> = {};
  for (const img of imageRows) {
    if (!imageMap[img.productId]) {
      imageMap[img.productId] = `${r2Base}/${img.objectKey}`;
    }
  }

  const items = rawItems.map((item) => ({
    ...item,
    imageUrl: imageMap[item.productId] ?? null,
  }));
  const history = await db.select().from(orderStatusHistory).where(
    eq(orderStatusHistory.orderId, id),
  ).orderBy(desc(orderStatusHistory.createdAt));
  const shipmentList = await db.select().from(shipments).where(eq(shipments.orderId, id));
  const addressList = await db.select().from(orderAddresses).where(eq(orderAddresses.orderId, id))
    .limit(1);

  return c.json({
    id: order.id,
    orderNumber: order.orderNumber,
    idempotencyKey: order.idempotencyKey,
    userId: order.userId,
    emailSnapshot: order.emailSnapshot,
    totalAmount: order.totalAmount,
    subtotalAmount: order.subtotalAmount,
    discountAmount: order.discountAmount,
    shippingAmount: order.shippingAmount,
    taxAmount: order.taxAmount,
    status: order.status as any,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,

    items,
    history,
    shipments: shipmentList,

    shippingSnapshot: addressList[0]?.shippingSnapshot || null,
    billingSnapshot: addressList[0]?.billingSnapshot || null,
  });
});

adminOrdersRouter.post(
  '/:id/status',
  requirePermission('orders.write'),
  zValidator('json', adminUpdateOrderStatusRequestSchema),
  async (c) => {
    const id = c.req.param('id');
    const { status, note } = c.req.valid('json');

    const orderResult = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!orderResult.length) return c.json({ error: 'Order not found' }, 404);

    // Note: Server-side status transition validation (e.g. cannot transition from 'cancelled' to 'shipped' easily, depending on business rules).
    // For simplicity, we just allow the transition and log it.

    await db.transaction(async (tx) => {
      await tx.update(orders).set({ status, updatedAt: new Date().toISOString() }).where(
        eq(orders.id, id),
      );
      await tx.insert(orderStatusHistory).values({
        orderId: id,
        status,
        note: note || `Status updated to ${status} by admin`,
      });

      // Release reservation if cancelled
      if (status === 'cancelled') {
        const items = await tx.select({
          variantId: orderItems.variantId,
          quantity: orderItems.quantity,
          warehouseId: inventoryLevels.warehouseId,
        }).from(orderItems)
          .leftJoin(inventoryLevels, eq(orderItems.variantId, inventoryLevels.variantId))
          .where(eq(orderItems.orderId, id));

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
              note: note || 'Cancelled by admin',
            });
          }
        }
      }
    });

    const order = orderResult[0];
    if (order.userId) {
      await sendNotification(
        order.userId,
        'order_update',
        `Update Status Pesanan #${order.orderNumber || order.id.slice(0, 8)}`,
        `Status pesanan Anda telah diperbarui menjadi ${status}.`,
        `/dashboard/orders/${order.id}`,
      );
    }

    return c.json({ data: { success: true, status } });
  },
);

adminOrdersRouter.post(
  '/:id/shipments',
  requirePermission('orders.write'),
  zValidator('json', adminAttachShipmentRequestSchema),
  async (c) => {
    const id = c.req.param('id') as string;
    const { carrier, trackingNumber } = c.req.valid('json');

    const orderResult = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!orderResult.length) return c.json({ error: 'Order not found' }, 404);

    await db.transaction(async (tx) => {
      await tx.insert(shipments).values({
        orderId: id,
        carrier,
        trackingNumber: trackingNumber || 'N/A',
        status: trackingNumber ? 'in_transit' : 'pending',
      });
      await tx.insert(orderStatusHistory).values({
        orderId: id,
        status: trackingNumber ? 'shipped' : 'processing',
        note: `[TRACKING] Kurir: ${carrier} | Resi: ${trackingNumber || 'N/A'}`,
      });
      if (trackingNumber) {
        await tx.update(orders).set({
          status: 'shipped',
          updatedAt: new Date().toISOString(),
        }).where(eq(orders.id, id));
      }
    });

    return c.json({ success: true });
  },
);

adminOrdersRouter.post(
  '/:id/biteship-pickup',
  requirePermission('orders.write'),
  async (c) => {
    const id = c.req.param('id') as string;

    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) return c.json({ error: 'Order not found' }, 404);

    const [address] = await db.select().from(orderAddresses).where(eq(orderAddresses.orderId, id))
      .limit(1);
    if (!address || !address.shippingSnapshot) {
      return c.json({ error: 'Order address not found' }, 400);
    }

    const items = await db.select({
      name: orderItems.productNameSnapshot,
      value: orderItems.priceSnapshot,
      quantity: orderItems.quantity,
      weight: sql<number>`COALESCE(${productVariants.weight}, 1000)`.mapWith(Number),
    })
      .from(orderItems)
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(eq(orderItems.orderId, id));

    const ship = address.shippingSnapshot as any;

    // Fallback store setting
    const storeOriginPostalCode = process.env.STORE_ORIGIN_POSTAL_CODE;
    const biteshipApiKey = process.env.BITESHIP_API_KEY;

    if (!biteshipApiKey) {
      return c.json({ error: 'Biteship API Key not configured' }, 500);
    }

    try {
      const payload = {
        shipper_contact_name: 'Admin Store',
        shipper_contact_phone: '081234567890',
        origin_postal_code: Number(storeOriginPostalCode),
        destination_contact_name: ship.fullName,
        destination_contact_phone: ship.phoneNumber,
        destination_postal_code: Number(ship.postalCode),
        destination_address: `${ship.streetAddress}, ${ship.city}, ${ship.province}`,
        courier_company: 'jne', // Ideally we store the chosen carrier during checkout!
        courier_type: 'reg',
        delivery_type: 'later',
        items: items.map((item) => ({
          name: item.name,
          value: item.value,
          weight: item.weight,
          quantity: item.quantity,
        })),
      };

      const response = await fetch('https://api.biteship.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': biteshipApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        return c.json({ error: result.error || 'Failed to create Biteship order' }, 400);
      }

      const biteshipOrderId = result.id;
      const waybillId = result.courier?.waybill_id || biteshipOrderId;
      const carrier = result.courier?.company || 'Biteship';

      await db.transaction(async (tx) => {
        await tx.insert(shipments).values({
          orderId: id,
          carrier: carrier,
          trackingNumber: waybillId,
          status: 'in_transit',
        });
        await tx.insert(orderStatusHistory).values({
          orderId: id,
          status: 'shipped',
          note: `[BITESHIP PICKUP] Kurir: ${carrier} | Resi/Order ID: ${waybillId}`,
        });
        await tx.update(orders).set({
          status: 'shipped',
          updatedAt: new Date().toISOString(),
        }).where(eq(orders.id, id));
      });

      return c.json({ success: true, biteship_order_id: biteshipOrderId });
    } catch (e: any) {
      return c.json({ error: e.message || 'Internal error' }, 500);
    }
  },
);

adminOrdersRouter.post(
  '/:id/tracking-token',
  requirePermission('orders.write'),
  async (c) => {
    const id = c.req.param('id') as string;

    const orderResult = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!orderResult.length) return c.json({ error: 'Order not found' }, 404);

    // Generate random token
    const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');

    const data = new TextEncoder().encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Expire in 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.insert(trackingTokens).values({
      orderId: id,
      tokenHash,
      expiresAt: expiresAt.toISOString(),
    });

    return c.json({ success: true, token });
  },
);

export { adminOrdersRouter };
