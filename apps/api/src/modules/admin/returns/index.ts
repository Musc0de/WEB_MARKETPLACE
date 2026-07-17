import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import {
  db,
  inventoryLevels,
  orderItems,
  productSalesStats,
  refunds,
  returnEvents,
  returnItems,
  returns,
} from '@starsuperscare/database';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  ReturnStatus,
  StatusMachineService,
} from '../../returns/services/status-machine.service.ts';
import { RefundCalculatorService } from '../../returns/services/refund-calculator.service.ts';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('orders.read'));

// GET /v1/admin/returns
app.get('/', async (c) => {
  const data = await db.query.returns.findMany({
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

// GET /v1/admin/returns/:id
app.get('/:id', async (c) => {
  const returnId = c.req.param('id');

  const ret = await db.query.returns.findFirst({
    where: eq(returns.id, returnId),
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

// POST /v1/admin/returns/:id/review
app.post(
  '/:id/review',
  zValidator(
    'json',
    z.object({
      action: z.enum(['approve', 'reject', 'request_evidence']),
      reason: z.string().optional(),
    }),
  ),
  async (c) => {
    const returnId = c.req.param('id');
    const { action, reason } = c.req.valid('json');
    const adminId = c.get('user').id;

    const ret = await db.query.returns.findFirst({ where: eq(returns.id, returnId) });
    if (!ret) return c.json({ error: 'Return not found' }, 404);

    let nextStatus: ReturnStatus;
    if (action === 'approve') nextStatus = 'approved';
    else if (action === 'reject') nextStatus = 'rejected';
    else nextStatus = 'awaiting_evidence';

    try {
      StatusMachineService.assertValidTransition(ret.status as ReturnStatus, nextStatus);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }

    const result = await db.transaction(async (tx) => {
      const [updatedReturn] = await tx.update(returns)
        .set({
          status: nextStatus,
          rejectionReason: action === 'reject' ? reason || null : null,
          assignedAdminId: adminId,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(returns.id, returnId))
        .returning();

      await tx.insert(returnEvents).values({
        returnId,
        eventType: `return_${nextStatus}`,
        actorType: 'admin',
        actorId: adminId,
        description: `Admin meninjau pengajuan dan memberikan status: ${nextStatus}. ${
          reason ? 'Alasan: ' + reason : ''
        }`,
      });

      return updatedReturn;
    });

    return c.json({ data: result, meta: { request_id: c.get('requestId') }, error: null });
  },
);

// POST /v1/admin/returns/:id/inspection
app.post(
  '/:id/inspection',
  zValidator(
    'json',
    z.object({
      items: z.array(z.object({
        orderItemId: z.string(),
        condition: z.enum(['restockable', 'damaged', 'defective']),
        restockDecision: z.enum(['restock', 'discard', 'repair']),
      })),
    }),
  ),
  async (c) => {
    const returnId = c.req.param('id');
    const { items } = c.req.valid('json');
    const adminId = c.get('user').id;

    const ret = await db.query.returns.findFirst({ where: eq(returns.id, returnId) });
    if (!ret) return c.json({ error: 'Return not found' }, 404);

    try {
      StatusMachineService.assertValidTransition(ret.status as ReturnStatus, 'inspection');
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }

    const result = await db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(returnItems)
          .set({ inspectionResult: item.condition, restockDecision: item.restockDecision })
          .where(
            and(eq(returnItems.returnId, returnId), eq(returnItems.orderItemId, item.orderItemId)),
          );

        if (item.restockDecision === 'restock') {
          const orderItem = await tx.query.orderItems.findFirst({
            where: eq(orderItems.id, item.orderItemId),
          });

          if (orderItem) {
            const rItem = await tx.query.returnItems.findFirst({
              where: and(
                eq(returnItems.returnId, returnId),
                eq(returnItems.orderItemId, item.orderItemId),
              ),
            });

            if (rItem) {
              const qty = rItem.quantity;

              // Update inventory
              await tx.execute(sql`
                UPDATE ${inventoryLevels}
                SET available = available + ${qty}, updated_at = NOW()
                WHERE product_id = ${orderItem.productId} AND variant_id = ${orderItem.variantId}
             `);

              // Update sales stats
              await tx.execute(sql`
                INSERT INTO ${productSalesStats} (product_id, refunded, net_sold, updated_at)
                VALUES (${orderItem.productId}, ${qty}, -${qty}, NOW())
                ON CONFLICT (product_id) DO UPDATE SET
                  refunded = ${productSalesStats}.refunded + ${qty},
                  net_sold = ${productSalesStats}.net_sold - ${qty},
                  updated_at = NOW()
             `);
            }
          }
        }
      }

      const nextStatus = ret.resolution === 'replacement'
        ? 'replacement_processing'
        : 'refund_processing';

      const [updatedReturn] = await tx.update(returns)
        .set({ status: nextStatus, updatedAt: new Date().toISOString() })
        .where(eq(returns.id, returnId))
        .returning();

      await tx.insert(returnEvents).values({
        returnId,
        eventType: 'inspection_completed',
        actorType: 'admin',
        actorId: adminId,
        description: 'Pemeriksaan barang selesai. Menunggu proses selanjutnya.',
      });

      return updatedReturn;
    });

    return c.json({ data: result, meta: { request_id: c.get('requestId') }, error: null });
  },
);

// POST /v1/admin/returns/:id/process-refund
app.post('/:id/process-refund', async (c) => {
  const returnId = c.req.param('id');
  const adminId = c.get('user').id; // Keep to record who processed it

  const ret = await db.query.returns.findFirst({ where: eq(returns.id, returnId) });
  if (!ret) return c.json({ error: 'Return not found' }, 404);

  try {
    StatusMachineService.assertValidTransition(ret.status as ReturnStatus, 'resolved');
  } catch (_err: any) {
    return c.json({ error: 'Pengembalian belum berada di tahap refund processing' }, 400);
  }

  const rItems = await db.query.returnItems.findMany({ where: eq(returnItems.returnId, returnId) });

  // Calculate max refundable based on actual math
  const maxRefund = await RefundCalculatorService.calculateMaxRefund(
    ret.orderId,
    rItems.map((i) => ({
      orderItemId: i.orderItemId,
      quantity: i.quantity,
    })),
  );

  // Typically we'd use a payment gateway API here, for now we record it as completed manually.
  const result = await db.transaction(async (tx) => {
    await tx.insert(refunds).values({
      orderId: ret.orderId,
      returnId,
      amount: maxRefund,
      status: 'completed', // Simulate immediate success or 'manual_review_required'
      providerReference: `REF-MANUAL-${Date.now()}`,
    });

    const [updatedReturn] = await tx.update(returns)
      .set({
        status: 'resolved',
        approvedAmount: maxRefund,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(returns.id, returnId))
      .returning();

    await tx.insert(returnEvents).values({
      returnId,
      eventType: 'refund_succeeded',
      actorType: 'system', // or 'admin'
      actorId: adminId,
      description: `Refund sebesar Rp ${maxRefund} telah diproses.`,
    });

    return updatedReturn;
  });

  return c.json({ data: result, meta: { request_id: c.get('requestId') }, error: null });
});

// PUT /v1/admin/returns/:id/status
app.put('/:id/status', zValidator('json', z.object({ status: z.string() })), async (c) => {
  const returnId = c.req.param('id');
  const { status } = c.req.valid('json');
  const adminId = c.get('user').id;
  const ret = await db.query.returns.findFirst({ where: eq(returns.id, returnId) });

  if (!ret) return c.json({ error: 'Return not found' }, 404);

  const result = await db.transaction(async (tx) => {
    const [updatedReturn] = await tx.update(returns)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(returns.id, returnId))
      .returning();

    await tx.insert(returnEvents).values({
      returnId,
      eventType: `status_updated_to_${status}`,
      actorType: 'admin',
      actorId: adminId,
      description: `Status diperbarui secara manual menjadi ${status}.`,
    });

    // AUTO-CREATE REFUND RECORD
    // If a return is 'Return & Refund', we create the refund when it is marked as 'received'.
    // If a return is 'Refund Only', we create the refund when it is marked as 'approved'.
    if (
      (status === 'approved' && ret.resolution === 'refund_only') ||
      (status === 'received' && ret.resolution === 'return_and_refund') ||
      (status === 'received' && ret.resolution === 'refund')
    ) {
      const existingRefund = await tx.query.refunds.findFirst({
        where: eq(refunds.returnId, returnId),
      });
      if (!existingRefund) {
        await tx.insert(refunds).values({
          orderId: ret.orderId,
          returnId: returnId,
          amount: ret.requestedAmount || 0,
          status: 'pending',
        });
      }
    }
    return updatedReturn;
  });
  return c.json({ data: result, meta: { request_id: c.get('requestId') }, error: null });
});

export { app as adminReturnsRouter };
