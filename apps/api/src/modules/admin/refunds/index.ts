import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { z } from 'zod';
import { db, refunds, returns } from '@starsuperscare/database';
import { desc, eq } from 'drizzle-orm';
import { processRefundRequestSchema } from '@starsuperscare/contracts';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('orders.read'));

// GET /v1/admin/refunds
app.get('/', async (c) => {
  const data = await db.query.refunds.findMany({
    orderBy: [desc(refunds.createdAt)],
  });

  // Fetch returns manually since relation might not be defined
  const returnIds = data.map((r) => r.returnId).filter(Boolean) as string[];
  let returnsMap: Record<string, any> = {};
  if (returnIds.length > 0) {
    const rets = await db.query.returns.findMany({
      where: (returns, { inArray }) => inArray(returns.id, returnIds),
    });
    returnsMap = rets.reduce((acc: any, r) => {
      acc[r.id] = r;
      return acc;
    }, {});
  }

  return c.json({
    data: data.map((r) => ({
      ...r,
      returnReason: r.returnId && returnsMap[r.returnId] ? returnsMap[r.returnId].reasonCode : null,
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
        proofImageUrl: payload.proofImageUrl || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(refunds.id, refundId))
      .returning();

    // 2. We no longer adjust sales stats or restock here.
    // It is handled during the returns inspection process in admin/returns/index.ts

    return updatedRefund;
  });

  return c.json({
    data: result,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// POST /v1/admin/refunds/:id/reject
app.post(
  '/:id/reject',
  zValidator('json', z.object({ reason: z.string().optional() })),
  async (c) => {
    const refundId = c.req.param('id');
    const payload = c.req.valid('json');

    const refund = await db.query.refunds.findFirst({
      where: eq(refunds.id, refundId),
    });

    if (!refund) {
      return c.json({ error: 'Refund not found' }, 404);
    }

    if (refund.status === 'completed' || refund.status === 'rejected') {
      return c.json({ error: 'Refund is already completed or rejected' }, 400);
    }

    const result = await db.transaction(async (tx) => {
      // 1. Mark refund as rejected
      const [updatedRefund] = await tx.update(refunds)
        .set({
          status: 'rejected',
          failureReason: payload.reason || 'Ditolak oleh admin',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(refunds.id, refundId))
        .returning();

      // 2. Also reject the return if it's attached
      if (refund.returnId) {
        await tx.update(returns)
          .set({ status: 'rejected', updatedAt: new Date().toISOString() })
          .where(eq(returns.id, refund.returnId));
      }

      return updatedRefund;
    });

    return c.json({
      data: result,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export { app as adminRefundsRouter };
