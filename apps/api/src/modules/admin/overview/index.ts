import { Hono } from 'hono';
import { count, eq, inArray, sum, and, isNull, ne } from 'drizzle-orm';
import { db, inventoryLevels, orders, productVariants, products } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get('/', requirePermission('orders.read'), async (c) => {
    // 1. Total Terjual (Total Sold/Sah)
    const [totalSold] = await db
      .select({ value: count() })
      .from(orders)
      .where(inArray(orders.status, ['paid', 'processing', 'shipped', 'delivered']));

    // 2. Menunggu Dikirim (Processing)
    const [waitingToShip] = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, 'processing'));

    // 3. Menunggu Dibayar (Pending)
    const [waitingPayment] = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, 'pending'));

    // 4. Total Stok Tersedia
    const [totalAvailableStock] = await db
      .select({ value: sum(inventoryLevels.available) })
      .from(inventoryLevels)
      .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(and(isNull(productVariants.deletedAt), ne(products.status, 'archived')));

    return c.json({
      data: {
        totalSold: totalSold.value,
        waitingToShip: waitingToShip.value,
        waitingPayment: waitingPayment.value,
        totalAvailableStock: totalAvailableStock.value ? Number(totalAvailableStock.value) : 0,
      },
    }, 200);
  });

export default routes;
