import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { desc, eq, sql } from 'drizzle-orm';
import {
  db,
  inventoryLevels,
  inventoryMovements,
  products,
  productVariants,
} from '@starsuperscare/database';
import { InventoryAdjustmentRequestSchema } from '@starsuperscare/contracts';
import { InventoryService } from '../../inventory/inventory.service.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get('/', requirePermission('catalog.read'), async (c) => {
    // In MVP, we just return all levels. In reality, add pagination.
    const levels = await db
      .select({
        id: inventoryLevels.id,
        variantId: inventoryLevels.variantId,
        warehouseId: inventoryLevels.warehouseId,
        available: inventoryLevels.available,
        reserved: inventoryLevels.reserved,
        damaged: inventoryLevels.damaged,
        updatedAt: inventoryLevels.updatedAt,
        variant: {
          sku: productVariants.sku,
        },
        product: {
          name: products.name,
        },
      })
      .from(inventoryLevels)
      .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id));

    return c.json({ data: levels }, 200);
  })
  .get(
    '/:variantId/movements',
    requirePermission('catalog.read'),
    zValidator('param', z.object({ variantId: z.string().uuid() })),
    async (c) => {
      const { variantId } = c.req.valid('param');

      const movements = await db.query.inventoryMovements.findMany({
        where: eq(inventoryMovements.variantId, variantId),
        orderBy: [desc(inventoryMovements.createdAt)],
        limit: 50, // MVP limit
      });

      return c.json({ data: movements }, 200);
    },
  )
  .get('/low-stock', requirePermission('catalog.read'), async (c) => {
    const lowStockLevels = await db
      .select({
        id: inventoryLevels.id,
        variantId: inventoryLevels.variantId,
        warehouseId: inventoryLevels.warehouseId,
        available: inventoryLevels.available,
        reserved: inventoryLevels.reserved,
        variant: {
          sku: productVariants.sku,
        },
        product: {
          name: products.name,
        },
      })
      .from(inventoryLevels)
      .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(sql`${inventoryLevels.available} < 10`)
      .orderBy(inventoryLevels.available);

    return c.json({ data: lowStockLevels }, 200);
  })
  .post(
    '/adjust',
    requirePermission('catalog.write'),
    zValidator('json', InventoryAdjustmentRequestSchema),
    async (c) => {
      const body = c.req.valid('json');

      try {
        await db.transaction(async (tx) => {
          await InventoryService.adjustStock(tx as any, {
            variantId: body.variantId,
            warehouseId: body.warehouseId,
            delta: body.delta,
            type: body.type,
            note: body.note,
          });
        });

        return c.json({ data: { success: true } }, 200);
      } catch (err: any) {
        if (err.message.includes('Insufficient stock')) {
          return c.json({ error: { code: 'BAD_REQUEST', message: err.message } }, 400);
        }
        if (err.message.includes('Concurrent modification')) {
          return c.json({ error: { code: 'CONFLICT', message: err.message } }, 409);
        }
        throw err;
      }
    },
  );

export default routes;
