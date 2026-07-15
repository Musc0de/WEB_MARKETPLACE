import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  adminAttachShipmentRequestSchema,
  adminUpdateOrderStatusRequestSchema,
} from '@starsuperscare/contracts';
import {
  db,
  orderAddresses,
  orderItems,
  orders,
  orderStatusHistory,
  shipments,
  trackingTokens,
  userProfiles,
} from '@starsuperscare/database';
import { authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { desc, eq, sql } from 'drizzle-orm';
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

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
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
    });

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

    await db.insert(shipments).values({
      orderId: id,
      carrier,
      trackingNumber: trackingNumber || 'N/A',
      status: trackingNumber ? 'in_transit' : 'pending',
    });

    return c.json({ success: true });
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
