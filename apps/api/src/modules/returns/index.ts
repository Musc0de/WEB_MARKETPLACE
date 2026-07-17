import { Hono } from 'hono';
import { zValidator } from '../../middleware/validator.ts';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import { db, returnItems, returns } from '@starsuperscare/database';
import { and, desc, eq } from 'drizzle-orm';
import { createReturnRequestSchema } from '@starsuperscare/contracts';
import { EligibilityService } from './services/eligibility.service.ts';
import { returnEvents } from '@starsuperscare/database';

type AppContext = {
  Variables: AuthContext['Variables'] & {
    requestId: string;
  };
};

const app = new Hono<AppContext>();

app.use('*', authMiddleware);

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

  // Verify ownership and eligibility of the order using EligibilityService
  const eligibility = await EligibilityService.checkReturnEligibility(payload.orderId, userId);

  if (!eligibility.eligible) {
    return c.json({
      error: eligibility.reasonMessage || 'Pesanan tidak memenuhi syarat untuk pengembalian.',
    }, 400);
  }

  // Create return and return items
  const result = await db.transaction(async (tx) => {
    const returnNumber = `RET-${Date.now().toString().slice(-6)}`;

    // Sum requested amount
    let totalRequestedAmount = 0;
    const itemsToInsert = [];

    for (const item of payload.items) {
      const eligibleItem = eligibility.eligibleItems.find((i) =>
        i.orderItemId === item.orderItemId
      );
      if (!eligibleItem) {
        throw new Error(`Item ${item.orderItemId} is not eligible`);
      }
      if (item.quantity > eligibleItem.remainingEligibleQuantity) {
        throw new Error(
          `Requested quantity exceeds eligible quantity for item ${item.orderItemId}`,
        );
      }

      const itemRequestedAmount = eligibleItem.paidUnitAmount * item.quantity;
      totalRequestedAmount += itemRequestedAmount;

      itemsToInsert.push({
        orderItemId: item.orderItemId,
        quantity: item.quantity,
        paidUnitAmount: eligibleItem.paidUnitAmount,
        requestedRefundAmount: itemRequestedAmount,
        reasonDetail: item.reasonDetail || null,
        condition: item.condition || null,
      });
    }

    const [newReturn] = await tx.insert(returns)
      .values({
        userId,
        orderId: payload.orderId,
        returnNumber,
        status: 'under_review',
        resolution: payload.resolution,
        reasonCode: payload.reason || null,
        requestedAmount: totalRequestedAmount,
      })
      .returning();

    for (const itemInsert of itemsToInsert) {
      await tx.insert(returnItems).values({
        returnId: newReturn.id,
        ...itemInsert,
      });
    }

    // Add Timeline Event
    await tx.insert(returnEvents).values({
      returnId: newReturn.id,
      eventType: 'return_requested',
      actorType: 'customer',
      actorId: userId,
      description: 'Pengajuan pengembalian berhasil dibuat dan sedang ditinjau.',
    });

    return newReturn;
  });

  return c.json({
    data: result,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export { app as returnsRouter };
