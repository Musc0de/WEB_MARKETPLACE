import { Hono } from 'hono';
import { db, orders } from '@starsuperscare/database';
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { historyQuerySchema } from '@starsuperscare/contracts';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get('/', zValidator('query', historyQuerySchema), async (c) => {
    const user = c.get('user');
    const query = c.req.valid('query');
    const { page, limit, status, year, start_date, end_date } = query;
    const offset = (page - 1) * limit;

    const conditions = [eq(orders.userId, user.id)];

    if (status) {
      conditions.push(eq(orders.status, status));
    }

    if (year) {
      const startOfYear = new Date(Date.UTC(year, 0, 1));
      const endOfYear = new Date(Date.UTC(year + 1, 0, 1));
      conditions.push(gte(orders.createdAt, startOfYear.toISOString()));
      conditions.push(lte(orders.createdAt, endOfYear.toISOString()));
    }

    if (start_date) {
      conditions.push(gte(orders.createdAt, new Date(start_date).toISOString()));
    }

    if (end_date) {
      conditions.push(lte(orders.createdAt, new Date(end_date).toISOString()));
    }

    const whereClause = and(...conditions);

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(whereClause);
    const total = totalResult.count;

    // Fetch paginated orders
    const historyList = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Calculate Summary
    const summaryResult = await db
      .select({
        totalTransactions: count(),
        totalNominal: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`.mapWith(Number),
        completedCount: sql<number>`SUM(CASE WHEN ${orders.status} = 'delivered' THEN 1 ELSE 0 END)`
          .mapWith(Number),
        refundCount: sql<number>`SUM(CASE WHEN ${orders.status} = 'refunded' THEN 1 ELSE 0 END)`
          .mapWith(Number),
        refundNominal: sql<
          number
        >`COALESCE(SUM(CASE WHEN ${orders.status} = 'refunded' THEN ${orders.totalAmount} ELSE 0 END), 0)`
          .mapWith(Number),
      })
      .from(orders)
      .where(whereClause);

    const summary = summaryResult[0] || {
      totalTransactions: 0,
      totalNominal: 0,
      completedCount: 0,
      refundCount: 0,
      refundNominal: 0,
    };

    return c.json({
      data: {
        items: historyList,
        summary,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
