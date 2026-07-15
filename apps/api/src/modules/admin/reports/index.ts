import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, count, desc, eq, gte, lte, sql, sum } from 'drizzle-orm';
import {
  db,
  inventoryLevels,
  orders,
  products,
  productVariants,
  returns as returnsTable,
  userProfiles,
} from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const DateFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

const routes = app
  .use('*', authMiddleware)
  .use('*', requirePermission('orders.read'))
  // ─── 1. Laporan Penjualan ─────────────────────────────────────────
  .get('/sales', zValidator('query', DateFilterSchema), async (c) => {
    const { startDate, endDate, page: pageStr, limit: limitStr } = c.req.valid('query');
    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (startDate) conditions.push(gte(orders.createdAt, new Date(startDate).toISOString()));
    if (endDate) conditions.push(lte(orders.createdAt, new Date(endDate).toISOString()));

    const [rows, countRes, summary] = await Promise.all([
      db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          customerEmail: orders.emailSnapshot,
          customerName: userProfiles.fullName,
          totalAmount: orders.totalAmount,
          status: orders.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(userProfiles, eq(orders.userId, userProfiles.userId))
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset),

      db.select({ count: count() }).from(orders).where(and(...conditions)),

      db
        .select({
          totalRevenue: sum(orders.totalAmount),
          totalOrders: count(),
        })
        .from(orders)
        .where(and(...conditions)),
    ]);

    return c.json({
      data: rows,
      total: Number(countRes[0]?.count ?? 0),
      page,
      limit,
      summary: {
        totalRevenue: Number(summary[0]?.totalRevenue ?? 0),
        totalOrders: Number(summary[0]?.totalOrders ?? 0),
      },
    });
  })
  // ─── 2. Laporan Keuangan ──────────────────────────────────────────
  .get('/financial', zValidator('query', DateFilterSchema), async (c) => {
    const { startDate, endDate, page: pageStr, limit: limitStr } = c.req.valid('query');
    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 100);
    const offset = (page - 1) * limit;

    const baseConditions = [];
    if (startDate) baseConditions.push(gte(orders.createdAt, new Date(startDate).toISOString()));
    if (endDate) baseConditions.push(lte(orders.createdAt, new Date(endDate).toISOString()));

    // Only paid/completed orders for financial revenue
    const paidConditions = [
      ...baseConditions,
      sql`${orders.status} IN ('paid', 'processing', 'shipped', 'delivered')`,
    ];

    const [rows, countRes, totals, cancelledData, refundedData] = await Promise.all([
      db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          customerEmail: orders.emailSnapshot,
          totalAmount: orders.totalAmount,
          status: orders.status,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(and(...paidConditions))
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset),

      db.select({ count: count() }).from(orders).where(and(...paidConditions)),

      db
        .select({ grossRevenue: sum(orders.totalAmount), totalTransactions: count() })
        .from(orders)
        .where(and(...paidConditions)),

      db
        .select({ cancelledCount: count() })
        .from(orders)
        .where(and(...baseConditions, eq(orders.status, 'cancelled'))),

      db
        .select({ refundedCount: count() })
        .from(orders)
        .where(and(...baseConditions, eq(orders.status, 'refunded'))),
    ]);

    return c.json({
      data: rows,
      total: Number(countRes[0]?.count ?? 0),
      page,
      limit,
      summary: {
        grossRevenue: Number(totals[0]?.grossRevenue ?? 0),
        totalTransactions: Number(totals[0]?.totalTransactions ?? 0),
        cancelledOrders: Number(cancelledData[0]?.cancelledCount ?? 0),
        refundedOrders: Number(refundedData[0]?.refundedCount ?? 0),
      },
    });
  })
  // ─── 3. Laporan Stok ──────────────────────────────────────────────
  .get('/stock', zValidator('query', DateFilterSchema), async (c) => {
    const { page: pageStr, limit: limitStr } = c.req.valid('query');
    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 100);
    const offset = (page - 1) * limit;

    const whereClause =
      sql`${productVariants.deletedAt} IS NULL AND ${products.status} != 'archived'`;

    const [rows, countRes, stockSummary] = await Promise.all([
      db
        .select({
          variantId: productVariants.id,
          productName: products.name,
          sku: productVariants.sku,
          productStatus: products.status,
          available: inventoryLevels.available,
          reserved: inventoryLevels.reserved,
          damaged: inventoryLevels.damaged,
          updatedAt: inventoryLevels.updatedAt,
        })
        .from(inventoryLevels)
        .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(whereClause)
        .orderBy(inventoryLevels.available)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: count() })
        .from(inventoryLevels)
        .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(whereClause),

      db
        .select({
          totalAvailable: sum(inventoryLevels.available),
          totalReserved: sum(inventoryLevels.reserved),
          totalDamaged: sum(inventoryLevels.damaged),
        })
        .from(inventoryLevels)
        .innerJoin(productVariants, eq(inventoryLevels.variantId, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(whereClause),
    ]);

    return c.json({
      data: rows,
      total: Number(countRes[0]?.count ?? 0),
      page,
      limit,
      summary: {
        totalAvailable: Number(stockSummary[0]?.totalAvailable ?? 0),
        totalReserved: Number(stockSummary[0]?.totalReserved ?? 0),
        totalDamaged: Number(stockSummary[0]?.totalDamaged ?? 0),
      },
    });
  })
  // ─── 4. Laporan Retur & Kehilangan ────────────────────────────────
  .get('/returns', zValidator('query', DateFilterSchema), async (c) => {
    const { startDate, endDate, page: pageStr, limit: limitStr } = c.req.valid('query');
    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 100);
    const offset = (page - 1) * limit;

    const conditions = [];
    if (startDate) {
      conditions.push(gte(returnsTable.createdAt, new Date(startDate).toISOString()));
    }
    if (endDate) {
      conditions.push(lte(returnsTable.createdAt, new Date(endDate).toISOString()));
    }

    const [rows, countRes, returnSummary] = await Promise.all([
      db
        .select({
          id: returnsTable.id,
          orderId: returnsTable.orderId,
          reason: returnsTable.reason,
          resolution: returnsTable.resolution,
          status: returnsTable.status,
          trackingNumber: returnsTable.trackingNumber,
          // Count items per return via subquery
          itemCount: sql<
            number
          >`(SELECT COUNT(*) FROM sss_return_items ri WHERE ri.return_id = ${returnsTable.id})`,
          createdAt: returnsTable.createdAt,
        })
        .from(returnsTable)
        .where(and(...conditions))
        .orderBy(desc(returnsTable.createdAt))
        .limit(limit)
        .offset(offset),

      db.select({ count: count() }).from(returnsTable).where(and(...conditions)),

      db
        .select({ totalReturns: count() })
        .from(returnsTable)
        .where(and(...conditions)),
    ]);

    // Also count damaged inventory for "kehilangan" context
    const [damagedStock] = await db
      .select({ totalDamaged: sum(inventoryLevels.damaged) })
      .from(inventoryLevels);

    return c.json({
      data: rows,
      total: Number(countRes[0]?.count ?? 0),
      page,
      limit,
      summary: {
        totalReturns: Number(returnSummary[0]?.totalReturns ?? 0),
        totalDamagedStock: Number(damagedStock?.totalDamaged ?? 0),
      },
    });
  });

export default routes;
