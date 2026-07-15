import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { db, returnItems, returns } from '@starsuperscare/database';
import { desc, eq } from 'drizzle-orm';
import { updateReturnStatusRequestSchema } from '@starsuperscare/contracts';

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

// PUT /v1/admin/returns/:id/status
app.put('/:id/status', zValidator('json', updateReturnStatusRequestSchema), async (c) => {
  const returnId = c.req.param('id');
  const payload = c.req.valid('json');

  const updates: any = { status: payload.status, updatedAt: new Date().toISOString() };
  if (payload.trackingNumber !== undefined) {
    updates.trackingNumber = payload.trackingNumber;
  }

  const [updatedReturn] = await db.update(returns)
    .set(updates)
    .where(eq(returns.id, returnId))
    .returning();

  if (!updatedReturn) {
    return c.json({ error: 'Return not found' }, 404);
  }

  return c.json({
    data: updatedReturn,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

export { app as adminReturnsRouter };
