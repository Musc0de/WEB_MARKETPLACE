import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { z } from 'zod';
import {
  db,
  inventoryLevels,
  orderItems,
  productSalesStats,
  refunds,
  returnItems,
  returns,
} from '@starsuperscare/database';
import { desc, eq, sql } from 'drizzle-orm';
import { processRefundRequestSchema } from '@starsuperscare/contracts';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('orders.read'));

// GET /v1/admin/refunds
app.get('/', async (c) => {
  const data = await db.query.refunds.findMany({
    orderBy: [desc(refunds.createdAt)],
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

// POST /v1/admin/refunds
// Create a new pending refund (usually from a return)
app.post(
  '/',
  zValidator('json', z.object({ returnId: z.string().uuid(), amount: z.number() }).passthrough()),
  async (c) => {
    const payload = c.req.valid('json');

    const ret = await db.query.returns.findFirst({
      where: eq(returns.id, payload.returnId),
    });

    if (!ret) {
      return c.json({ error: 'Return not found' }, 404);
    }

    const [refund] = await db.insert(refunds)
      .values({
        orderId: ret.orderId,
        returnId: ret.id,
        amount: payload.amount,
        status: 'pending',
      })
      .returning();

    return c.json({
      data: refund,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

// POST /v1/admin/refunds/:id/process
app.post('/:id/process', zValidator('json', processRefundRequestSchema), async (c) => {
  const refundId = c.req.param('id');
  const payload = c.req.valid('json');

  const refund = await db.query.refunds.findFirst({
    where: eq(refunds.id, refundId),
  });

  if (!refund) {
    return c.json({ error: 'Refund not found' }, 404);
  }

  if (refund.status === 'completed') {
    return c.json({ error: 'Refund is already completed' }, 400);
  }

  const finalAmount = payload.amount !== undefined ? payload.amount : refund.amount;

  const result = await db.transaction(async (tx) => {
    // 1. Mark refund as completed
    const [updatedRefund] = await tx.update(refunds)
      .set({
        status: 'completed',
        amount: finalAmount,
        providerReference: `REF-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(refunds.id, refundId))
      .returning();

    // 2. Adjust sales stats if this is tied to a return
    if (refund.returnId) {
      const items = await tx.select({
        productId: orderItems.productId,
        variantId: orderItems.variantId,
        quantity: returnItems.quantity,
      })
        .from(returnItems)
        .innerJoin(orderItems, eq(orderItems.id, returnItems.orderItemId))
        .where(eq(returnItems.returnId, refund.returnId));

      for (const item of items) {
        const productId = item.productId;
        const variantId = item.variantId;
        const qty = item.quantity;

        // Update sales stats
        await tx.execute(sql`
          INSERT INTO ${productSalesStats} (product_id, refunded, net_sold, updated_at)
          VALUES (${productId}, ${qty}, -${qty}, NOW())
          ON CONFLICT (product_id) DO UPDATE SET
            refunded = ${productSalesStats}.refunded + ${qty},
            net_sold = ${productSalesStats}.net_sold - ${qty},
            updated_at = NOW()
        `);

        // Update inventory if restock requested
        if (payload.restockItems) {
          await tx.execute(sql`
            UPDATE ${inventoryLevels}
            SET 
              available = available + ${qty},
              updated_at = NOW()
            WHERE product_id = ${productId} AND variant_id = ${variantId}
          `);
        }
      }
    }

    return updatedRefund;
  });

  return c.json({
    data: result,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export { app as adminRefundsRouter };
