import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import {
  db,
  inventoryLevels,
  inventoryMovements,
  productImages,
  products,
  productVariants,
  stores,
  warehouses,
} from '@starsuperscare/database';
import {
  AdminProductCreateSchema,
  AdminProductImageAddSchema,
  AdminProductUpdateSchema,
} from '@starsuperscare/contracts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { logAudit } from '../../../utils/audit.ts';
import { eq, isNull, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { storageAdapter } from '../../../adapters/storage.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  // Ensure every endpoint here requires at least catalog.read
  .use('*', requirePermission('catalog.read'))
  .get('/', async (c) => {
    // Parse pagination params
    const page = Math.max(1, Number(c.req.query('page') ?? 1));
    const limit = Math.min(200, Math.max(1, Number(c.req.query('limit') ?? 50)));
    const offset = (page - 1) * limit;

    // Exclude soft-deleted products
    const [countRow] = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(products)
      .where(isNull(products.deletedAt));

    const total = Number(countRow?.total ?? 0);

    // Status counts for admin stats cards (excludes soft-deleted)
    const statusCountsRaw = await db
      .select({ status: products.status, count: sql<number>`COUNT(*)` })
      .from(products)
      .where(isNull(products.deletedAt))
      .groupBy(products.status);

    const statusCounts = Object.fromEntries(
      statusCountsRaw.map((r) => [r.status, Number(r.count)]),
    );

    const list = await db
      .select()
      .from(products)
      .where(isNull(products.deletedAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      data: list,
      total,
      statusCounts,
      page,
      limit,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const [item] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!item) throw new HTTPException(404, { message: 'Product not found' });
    return c.json({ data: item, meta: { request_id: c.get('requestId') }, error: null });
  })
  .get('/:id/variants', async (c) => {
    const id = c.req.param('id');
    const listRaw = await db.select({
      id: productVariants.id,
      productId: productVariants.productId,
      sku: productVariants.sku,
      price: productVariants.price,
      comparePrice: productVariants.comparePrice,
      createdAt: productVariants.createdAt,
      updatedAt: productVariants.updatedAt,
      availableStock: inventoryLevels.available,
      optionValues: productVariants.optionValues,
      initialStock: sql<
        number
      >`COALESCE((SELECT quantity FROM sss_inventory_movements WHERE variant_id = ${productVariants.id} AND type = 'initial' LIMIT 1), 0)`
        .as('initial_stock'),
    })
      .from(productVariants)
      .leftJoin(inventoryLevels, eq(inventoryLevels.variantId, productVariants.id))
      .where(eq(productVariants.productId, id));

    const list = listRaw.map((v) => ({
      ...v,
      name: (v.optionValues as any)?.name || null,
      size: (v.optionValues as any)?.size || null,
    }));

    return c.json({ data: list, meta: { request_id: c.get('requestId') }, error: null });
  })
  .post(
    '/:id/variants',
    requirePermission('catalog.write'),
    zValidator(
      'json',
      z.object({
        sku: z.string().optional(),
        name: z.string().optional(),
        price: z.number(),
        comparePrice: z.number().optional(),
        initialStock: z.number().optional(),
        size: z.string().optional(),
      }),
    ),
    async (c) => {
      const id = c.req.param('id');
      const data = c.req.valid('json');
      let newVariant;

      // Auto-generate SKU if empty
      const generatedSku = data.sku ||
        `SKU-${Date.now().toString(36).toUpperCase()}-${
          Math.random().toString(36).substring(2, 6).toUpperCase()
        }`;

      try {
        [newVariant] = await db.transaction(async (tx) => {
          const [variant] = await tx.insert(productVariants).values({
            productId: id,
            sku: generatedSku,
            price: data.price,
            comparePrice: data.comparePrice ?? null,
            optionValues: (data.size || data.name) ? { size: data.size, name: data.name } : null,
          }).returning();

          const [defaultWarehouse] = await tx.select().from(warehouses).limit(1);
          const warehouseId = defaultWarehouse?.id;
          if (!warehouseId) throw new HTTPException(500, { message: 'No warehouse configured' });

          // Create empty inventory record for the new variant
          await tx.insert(inventoryLevels).values({
            variantId: variant.id,
            warehouseId,
            available: data.initialStock || 0,
          });

          if (data.initialStock && data.initialStock > 0) {
            await tx.insert(inventoryMovements).values({
              variantId: variant.id,
              warehouseId,
              quantity: data.initialStock,
              type: 'initial',
              note: 'Stok Awal Sistem',
            });
          }

          return [variant];
        });
      } catch (err: any) {
        if (err.message?.includes('sss_product_variants_sku_unique')) {
          throw new HTTPException(400, {
            message: `SKU "${data.sku}" sudah digunakan oleh varian lain.`,
          });
        }
        throw err;
      }

      return c.json(
        { data: newVariant, meta: { request_id: c.get('requestId') }, error: null },
        201,
      );
    },
  )
  .put(
    '/:id/variants/:variantId',
    requirePermission('catalog.write'),
    zValidator(
      'json',
      z.object({
        sku: z.string().optional(),
        name: z.string().optional(),
        price: z.number(),
        comparePrice: z.number().optional(),
        size: z.string().optional(),
      }),
    ),
    async (c) => {
      const variantId = c.req.param('variantId') as string;
      const data = c.req.valid('json');
      let updated;

      // Keep existing SKU if not provided in PUT, or we can just assume the frontend sends the existing one.
      // We will only update SKU if it's provided.
      const updateData: any = {
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        optionValues: (data.size || data.name) ? { size: data.size, name: data.name } : null,
        updatedAt: new Date().toISOString(),
      };
      if (data.sku) updateData.sku = data.sku;

      try {
        [updated] = await db.update(productVariants)
          .set(updateData)
          .where(eq(productVariants.id, variantId))
          .returning();
      } catch (err: any) {
        if (err.message?.includes('sss_product_variants_sku_unique')) {
          throw new HTTPException(400, {
            message: `SKU "${data.sku}" sudah digunakan oleh varian lain.`,
          });
        }
        throw err;
      }

      if (!updated) throw new HTTPException(404, { message: 'Variant not found' });
      return c.json({ data: updated, meta: { request_id: c.get('requestId') }, error: null });
    },
  )
  .delete(
    '/:id/variants/:variantId',
    requirePermission('catalog.write'),
    async (c) => {
      const variantId = c.req.param('variantId') as string;
      const [deleted] = await db.delete(productVariants).where(eq(productVariants.id, variantId))
        .returning();
      if (!deleted) throw new HTTPException(404, { message: 'Variant not found' });
      return c.json({
        data: { success: true },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
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

      let storeId = data.storeId;
      if (!storeId) {
        const [defaultStore] = await db.select().from(stores).limit(1);
        if (!defaultStore) throw new HTTPException(500, { message: 'No stores available' });
        storeId = defaultStore.id;
      }

      const product = await db.transaction(async (tx) => {
        const [newProduct] = await tx.insert(products).values({
          ...data,
          storeId,
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

      await tx.update(productVariants).set({
        deletedAt: new Date().toISOString(),
      }).where(eq(productVariants.productId, id));

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
        status: 'published', // Unified single live status
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
        status: 'draft', // Unpublished → back to draft
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
  })
  .post(
    '/:id/images',
    requirePermission('catalog.write'),
    zValidator('json', AdminProductImageAddSchema),
    async (c) => {
      const id = c.req.param('id') as string;
      const data = c.req.valid('json');

      const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (!product) throw new HTTPException(404, { message: 'Product not found' });

      // If this is marked as primary, unmark others (optional, but good practice)
      if (data.isPrimary) {
        await db.update(productImages)
          .set({ isPrimary: false })
          .where(eq(productImages.productId, id));
      }

      const [_image] = await db.insert(productImages).values({
        productId: id,
        objectKey: data.objectKey,
        isPrimary: data.isPrimary,
      }).returning();

      return c.json({
        data: { success: true },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .get('/:id/images', requirePermission('catalog.read'), async (c) => {
    const id = c.req.param('id') as string;
    const images = await db.select().from(productImages).where(eq(productImages.productId, id));

    const mapped = await Promise.all(
      images.map(async (img) => ({
        id: img.id,
        objectKey: img.objectKey,
        isPrimary: img.isPrimary,
        url: await storageAdapter.generatePresignedDownloadUrl(img.objectKey),
      })),
    );

    return c.json({ data: mapped, meta: { request_id: c.get('requestId') }, error: null });
  })
  .delete(
    '/:id/images/:imageId',
    requirePermission('catalog.write'),
    async (c) => {
      const imageId = c.req.param('imageId') as string;

      const [img] = await db.select().from(productImages).where(eq(productImages.id, imageId))
        .limit(1);
      if (!img) throw new HTTPException(404, { message: 'Image not found' });

      // Delete from DB
      await db.delete(productImages).where(eq(productImages.id, imageId));

      // Try deleting from S3/R2, but don't fail the request if it errors
      try {
        await storageAdapter.deleteObject(img.objectKey);
      } catch (e) {
        console.error('Failed to delete object from storage:', e);
      }

      return c.json({
        data: { success: true },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  );

export default routes;
