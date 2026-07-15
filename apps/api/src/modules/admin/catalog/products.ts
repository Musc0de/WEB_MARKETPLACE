import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, products, productVariants } from '@starsuperscare/database';
import { AdminProductCreateSchema, AdminProductUpdateSchema } from '@starsuperscare/contracts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { logAudit } from '../../../utils/audit.ts';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  // Ensure every endpoint here requires at least catalog.read
  .use('*', requirePermission('catalog.read'))
  .get('/', async (c) => {
    const list = await db.select().from(products);
    return c.json({ data: list, meta: { request_id: c.get('requestId') }, error: null });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const [item] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!item) throw new HTTPException(404, { message: 'Product not found' });
    return c.json({ data: item, meta: { request_id: c.get('requestId') }, error: null });
  })
  .get('/:id/variants', async (c) => {
    const id = c.req.param('id');
    const list = await db.select().from(productVariants).where(eq(productVariants.productId, id));
    return c.json({ data: list, meta: { request_id: c.get('requestId') }, error: null });
  })
  .post(
    '/:id/variants',
    requirePermission('catalog.write'),
    zValidator('json', z.object({ sku: z.string(), price: z.number() })),
    async (c) => {
      const id = c.req.param('id');
      const data = c.req.valid('json');
      const [newVariant] = await db.insert(productVariants).values({
        productId: id,
        sku: data.sku,
        price: data.price,
      }).returning();
      return c.json(
        { data: newVariant, meta: { request_id: c.get('requestId') }, error: null },
        201,
      );
    },
  )
  .post(
    '/',
    requirePermission('catalog.write'),
    zValidator('json', AdminProductCreateSchema),
    async (c) => {
      const data = c.req.valid('json');
      const user = c.get('user');

      // generate slug from name
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const existing = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
      if (existing.length > 0) {
        throw new HTTPException(409, { message: 'Product slug conflict' });
      }

      const product = await db.transaction(async (tx) => {
        const [newProduct] = await tx.insert(products).values({
          ...data,
          slug,
          brandId: data.brandId || null,
          description: data.description || null,
        }).returning();
        await logAudit(tx, {
          actorId: user.id,
          entityType: 'product',
          entityId: newProduct.id,
          action: 'create',
          changes: { after: newProduct },
        });
        return newProduct;
      });

      return c.json({ data: product, meta: { request_id: c.get('requestId') }, error: null }, 201);
    },
  )
  .put(
    '/:id',
    requirePermission('catalog.write'),
    zValidator('json', AdminProductUpdateSchema),
    async (c) => {
      const id = c.req.param('id') as string;
      const data = c.req.valid('json');
      const user = c.get('user');

      const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (!existing) throw new HTTPException(404, { message: 'Product not found' });

      if (existing.version !== data.version) {
        throw new HTTPException(409, {
          message: 'Optimistic concurrency failure: versions mismatch',
        });
      }

      const updatedProduct = await db.transaction(async (tx) => {
        const [updated] = await tx.update(products).set({
          ...data as any,
          brandId: data.brandId || null,
          description: data.description || null,
          version: existing.version + 1,
          updatedAt: new Date().toISOString(),
        }).where(eq(products.id, id)).returning();

        await logAudit(tx, {
          actorId: user.id,
          entityType: 'product',
          entityId: id,
          action: 'update',
          changes: { before: existing, after: updated },
        });
        return updated;
      });

      return c.json({
        data: updatedProduct,
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .delete('/:id', requirePermission('catalog.write'), async (c) => {
    const id = c.req.param('id') as string;
    const user = c.get('user');

    const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing) throw new HTTPException(404, { message: 'Product not found' });

    await db.transaction(async (tx) => {
      await tx.update(products).set({
        status: 'archived',
        deletedAt: new Date().toISOString(),
      }).where(eq(products.id, id));

      await logAudit(tx, {
        actorId: user.id,
        entityType: 'product',
        entityId: id,
        action: 'delete',
        changes: { before: existing },
      });
    });

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post('/:id/publish', requirePermission('catalog.publish'), async (c) => {
    const id = c.req.param('id') as string;
    const user = c.get('user');

    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) throw new HTTPException(404, { message: 'Product not found' });

    // Validate minimum data
    const variants = await db.select().from(productVariants).where(
      eq(productVariants.productId, id),
    );
    if (variants.length === 0) {
      throw new HTTPException(400, { message: 'Cannot publish product without variants' });
    }

    await db.transaction(async (tx) => {
      await tx.update(products).set({
        status: 'active',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: product.version + 1,
      }).where(eq(products.id, id));

      await logAudit(tx, {
        actorId: user.id,
        entityType: 'product',
        entityId: id,
        action: 'publish',
        changes: { before: product },
      });
    });

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .post('/:id/unpublish', requirePermission('catalog.publish'), async (c) => {
    const id = c.req.param('id') as string;
    const user = c.get('user');

    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) throw new HTTPException(404, { message: 'Product not found' });

    await db.transaction(async (tx) => {
      await tx.update(products).set({
        status: 'inactive',
        updatedAt: new Date().toISOString(),
        version: product.version + 1,
      }).where(eq(products.id, id));

      await logAudit(tx, {
        actorId: user.id,
        entityType: 'product',
        entityId: id,
        action: 'unpublish',
        changes: { before: product },
      });
    });

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
