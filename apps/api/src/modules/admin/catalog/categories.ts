import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { categories, db } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { logAudit } from '../../../utils/audit.ts';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { AdminCategoryCreateSchema, AdminCategoryUpdateSchema } from '@starsuperscare/contracts';

const app = new Hono<AuthContext>();

app.use('*', authMiddleware);
app.use('*', requirePermission('catalog.read'));

app.get('/', async (c) => {
  const page = Math.max(1, Number(c.req.query('page') ?? 1));
  const limit = Math.min(200, Math.max(1, Number(c.req.query('limit') ?? 50)));
  const offset = (page - 1) * limit;

  const [countRow] = await db.select({ total: sql<number>`COUNT(*)` })
    .from(categories)
    .where(isNull(categories.deletedAt));

  const total = Number(countRow?.total ?? 0);

  const items = await db.select()
    .from(categories)
    .where(isNull(categories.deletedAt))
    .orderBy(desc(categories.createdAt))
    .limit(limit)
    .offset(offset);

  return c.json({
    data: {
      items,
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const [category] = await db.select().from(categories).where(
    and(eq(categories.id, id), isNull(categories.deletedAt)),
  ).limit(1);
  if (!category) throw new HTTPException(404, { message: 'Category not found' });
  return c.json({ data: category, meta: { request_id: c.get('requestId') }, error: null });
});

app.post(
  '/',
  requirePermission('catalog.write'),
  zValidator('json', AdminCategoryCreateSchema),
  async (c) => {
    const data = c.req.valid('json');
    const user = c.get('user');

    const existing = await db.select().from(categories).where(
      and(eq(categories.slug, data.slug), isNull(categories.deletedAt)),
    ).limit(1);
    if (existing.length > 0) {
      throw new HTTPException(409, {
        message: 'Category slug already exists',
      });
    }

    const category = await db.transaction(async (tx) => {
      const [newCat] = await tx.insert(categories).values(data).returning();
      await logAudit(tx, {
        actorId: user.id,
        entityType: 'category',
        entityId: newCat.id,
        action: 'create',
        changes: { after: newCat },
      });
      return newCat;
    });

    return c.json({ data: category, meta: { request_id: c.get('requestId') }, error: null }, 201);
  },
);

app.put(
  '/:id',
  requirePermission('catalog.write'),
  zValidator('json', AdminCategoryUpdateSchema),
  async (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const user = c.get('user');

    const [existingCat] = await db.select().from(categories).where(
      and(eq(categories.id, id), isNull(categories.deletedAt)),
    ).limit(1);
    if (!existingCat) throw new HTTPException(404, { message: 'Category not found' });

    if (data.slug && data.slug !== existingCat.slug) {
      const slugConflict = await db.select().from(categories).where(
        and(eq(categories.slug, data.slug), isNull(categories.deletedAt)),
      ).limit(1);
      if (slugConflict.length > 0) {
        throw new HTTPException(409, {
          message: 'Category slug already exists',
        });
      }
    }

    const category = await db.transaction(async (tx) => {
      const [updated] = await tx.update(categories).set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
        .where(eq(categories.id, id)).returning();
      await logAudit(tx, {
        actorId: user.id,
        entityType: 'category',
        entityId: id,
        action: 'update',
        changes: { before: existingCat, after: updated },
      });
      return updated;
    });

    return c.json({ data: category, meta: { request_id: c.get('requestId') }, error: null });
  },
);

app.delete('/:id', requirePermission('catalog.write'), async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');

  const [existingCat] = await db.select().from(categories).where(
    and(eq(categories.id, id), isNull(categories.deletedAt)),
  ).limit(1);
  if (!existingCat) throw new HTTPException(404, { message: 'Category not found' });

  await db.transaction(async (tx) => {
    await tx.update(categories).set({ deletedAt: new Date().toISOString() }).where(
      eq(categories.id, id),
    );
    await logAudit(tx, {
      actorId: user.id,
      entityType: 'category',
      entityId: id,
      action: 'delete',
      changes: { before: existingCat, after: null },
    });
  });

  return c.json({ data: { success: true }, meta: { request_id: c.get('requestId') }, error: null });
});

export default app;
