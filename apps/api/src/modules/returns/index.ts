import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import {
  db,
  orderItems,
  orders,
  productImages,
  returnItems,
  returns,
} from '@starsuperscare/database';
import { and, desc, eq, sql } from 'drizzle-orm';
import { createReturnRequestSchema } from '@starsuperscare/contracts';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

const app = new Hono<AppContext>();

app.use('*', authMiddleware);

// GET /v1/returns/eligible
// Returns order items that belong to the user, are from delivered orders, and are within 7 days
app.get('/eligible', async (c) => {
  const userId = c.get('user').id;

  // We can fetch eligible items based on order status
  const items = await db.select({
    orderItemId: orderItems.id,
    orderId: orders.id,
    orderNumber: orders.orderNumber,
    productId: orderItems.productId,
    variantId: orderItems.variantId,
    productName: orderItems.productNameSnapshot,
    variantSku: orderItems.variantSkuSnapshot,
    purchasedAt: orders.createdAt,
    price: orderItems.priceSnapshot,
    quantity: orderItems.quantity,
    primaryImage: sql<string>`(
      SELECT object_key FROM ${productImages}
      WHERE product_id = ${orderItems.productId}
      ORDER BY sort_order ASC
      LIMIT 1
    )`,
  })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.status, 'delivered'),
        // Return window (e.g. 14 days)
        sql`${orders.updatedAt} >= NOW() - INTERVAL '14 days'`,
      ),
    )
    .orderBy(desc(orders.createdAt));

  return c.json({
    data: items,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// GET /v1/returns
app.get('/', async (c) => {
  const userId = c.get('user').id;

  const data = await db.query.returns.findMany({
    where: eq(returns.userId, userId),
    orderBy: [desc(returns.createdAt)],
  });

  return c.json({
    data: data.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
    })),
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// GET /v1/returns/:id
app.get('/:id', async (c) => {
  const userId = c.get('user').id;
  const returnId = c.req.param('id');

  const ret = await db.query.returns.findFirst({
    where: and(eq(returns.id, returnId), eq(returns.userId, userId)),
  });

  if (!ret) {
    return c.json({ error: 'Return not found' }, 404);
  }

  const items = await db.query.returnItems.findMany({
    where: eq(returnItems.returnId, returnId),
  });

  return c.json({
    data: {
      ...ret,
      items,
      createdAt: new Date(ret.createdAt).toISOString(),
      updatedAt: ret.updatedAt ? new Date(ret.updatedAt).toISOString() : new Date().toISOString(),
    },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// POST /v1/returns
app.post('/', zValidator('json', createReturnRequestSchema), async (c) => {
  const userId = c.get('user').id;
  const payload = c.req.valid('json');

  // Verify ownership and eligibility of the order
  const order = await db.query.orders.findFirst({
    where: and(
      eq(orders.id, payload.orderId),
      eq(orders.userId, userId),
      eq(orders.status, 'delivered'),
    ),
  });

  if (!order) {
    return c.json({ error: 'Order is not eligible for return' }, 400);
  }

  // Create return and return items
  const result = await db.transaction(async (tx) => {
    const [newReturn] = await tx.insert(returns)
      .values({
        userId,
        orderId: payload.orderId,
        status: 'pending',
        resolution: payload.resolution,
        reason: payload.reason || null,
      })
      .returning();

    for (const item of payload.items) {
      await tx.insert(returnItems).values({
        returnId: newReturn.id,
        orderItemId: item.orderItemId,
        quantity: item.quantity,
        reasonDetail: item.reasonDetail || null,
        condition: item.condition || null,
      });
    }

    return newReturn;
  });

  return c.json({
    data: result,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export { app as returnsRouter };
