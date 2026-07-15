import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { brands, db } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { logAudit } from '../../../utils/audit.ts';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { AdminBrandCreateSchema, AdminBrandUpdateSchema } from '@starsuperscare/contracts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .use('*', requirePermission('catalog.read'))
  .get('/', async (c) => {
    const page = Math.max(1, Number(c.req.query('page') ?? 1));
    const limit = Math.min(200, Math.max(1, Number(c.req.query('limit') ?? 50)));
    const offset = (page - 1) * limit;

    const [countRow] = await db.select({ total: sql<number>`COUNT(*)` })
      .from(brands)
      .where(isNull(brands.deletedAt));

    const total = Number(countRow?.total ?? 0);

    const items = await db.select()
      .from(brands)
      .where(isNull(brands.deletedAt))
      .orderBy(desc(brands.createdAt))
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
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    if (!id) throw new HTTPException(400, { message: 'Invalid ID' });
    const [brand] = await db.select().from(brands).where(
      and(eq(brands.id, id), isNull(brands.deletedAt)),
    ).limit(1);
    if (!brand) throw new HTTPException(404, { message: 'Brand not found' });
    return c.json({ data: brand, meta: { request_id: c.get('requestId') }, error: null });
  })
  .post(
    '/',
    requirePermission('catalog.write'),
    zValidator('json', AdminBrandCreateSchema),
    async (c) => {
      const data = c.req.valid('json');
      const user = c.get('user');

      const existing = await db.select().from(brands).where(
        and(eq(brands.slug, data.slug), isNull(brands.deletedAt)),
      ).limit(1);
      if (existing.length > 0) {
        throw new HTTPException(409, { message: 'Brand slug already exists' });
      }

      const insertData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined),
      ) as any;

      const brand = await db.transaction(async (tx) => {
        const [newBrand] = await tx.insert(brands).values(insertData as any).returning();
        await logAudit(tx, {
          actorId: user.id,
          entityType: 'brand',
          entityId: newBrand.id,
          action: 'create',
          changes: { after: newBrand },
        });
        return newBrand;
      });

      return c.json({ data: brand, meta: { request_id: c.get('requestId') }, error: null }, 201);
    },
  )
  .put(
    '/:id',
    requirePermission('catalog.write'),
    zValidator('json', AdminBrandUpdateSchema),
    async (c) => {
      const id = c.req.param('id');
      if (!id) throw new HTTPException(400, { message: 'Invalid ID' });
      const data = c.req.valid('json');
      const user = c.get('user');

      const [existingBrand] = await db.select().from(brands).where(
        and(eq(brands.id, id), isNull(brands.deletedAt)),
      ).limit(1);
      if (!existingBrand) throw new HTTPException(404, { message: 'Brand not found' });

      if (data.slug && data.slug !== existingBrand.slug) {
        const slugConflict = await db.select().from(brands).where(
          and(eq(brands.slug, data.slug), isNull(brands.deletedAt)),
        ).limit(1);
        if (slugConflict.length > 0) {
          throw new HTTPException(409, {
            message: 'Brand slug already exists',
          });
        }
      }

      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined),
      );

      const brand = await db.transaction(async (tx) => {
        const [updated] = await tx.update(brands).set({
          ...(updateData as any),
          updatedAt: new Date().toISOString(),
        } as any)
          .where(eq(brands.id, id)).returning();
        await logAudit(tx, {
          actorId: user.id,
          entityType: 'brand',
          entityId: id,
          action: 'update',
          changes: { before: existingBrand, after: updated },
        });
        return updated;
      });

      return c.json({ data: brand, meta: { request_id: c.get('requestId') }, error: null });
    },
  )
  .delete('/:id', requirePermission('catalog.write'), async (c) => {
    const id = c.req.param('id');
    if (!id) throw new HTTPException(400, { message: 'Invalid ID' });
    const user = c.get('user');

    const [existingBrand] = await db.select().from(brands).where(
      and(eq(brands.id, id), isNull(brands.deletedAt)),
    ).limit(1);
    if (!existingBrand) throw new HTTPException(404, { message: 'Brand not found' });

    await db.transaction(async (tx) => {
      await tx.update(brands).set({ deletedAt: new Date().toISOString() }).where(
        eq(brands.id, id),
      );
      await logAudit(tx, {
        actorId: user.id,
        entityType: 'brand',
        entityId: id,
        action: 'delete',
        changes: { before: existingBrand, after: null },
      });
    });

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
