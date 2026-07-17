import { Hono } from 'hono';
import { cancellationRequests, db, orderItems, orders, returns } from '@starsuperscare/database';
import { and, count, desc, eq, gte, inArray, lte, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
        status: z.string().optional(),
        year: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { page, limit, status, year, start_date, end_date } = c.req.valid('query');
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions: any[] = [eq(orders.userId, user.id)];

      // Status filter — we filter by base DB status only; override happens after fetching returns/cancellations
      if (status === 'delivered') {
        conditions.push(eq(orders.status, 'delivered'));
      } else if (status === 'refunded') {
        // Show refunded + orders that have active returns
        conditions.push(or(eq(orders.status, 'refunded'), eq(orders.status, 'cancelled')));
      } else if (status === 'cancelled') {
        conditions.push(eq(orders.status, 'cancelled'));
      } else if (status === 'pending') {
        conditions.push(eq(orders.status, 'pending'));
      }

      // Year filter
      if (year) {
        const yearNum = parseInt(year, 10);
        const start = new Date(`${yearNum}-01-01T00:00:00.000Z`).toISOString();
        const end = new Date(`${yearNum}-12-31T23:59:59.999Z`).toISOString();
        conditions.push(gte(orders.createdAt, start));
        conditions.push(lte(orders.createdAt, end));
      }

      if (start_date) {
        conditions.push(gte(orders.createdAt, new Date(start_date).toISOString()));
      }
      if (end_date) {
        conditions.push(lte(orders.createdAt, new Date(end_date).toISOString()));
      }

      const whereClause = and(...conditions);

      // Run count + list + summary in parallel for efficiency
      const [totalResult, historyList, summaryResult] = await Promise.all([
        db.select({ count: count() }).from(orders).where(whereClause),
        db
          .select()
          .from(orders)
          .where(whereClause)
          .orderBy(desc(orders.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({
            totalTransactions: count(),
            totalNominal: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`.mapWith(Number),
            completedCount: sql<
              number
            >`SUM(CASE WHEN ${orders.status} = 'delivered' AND NOT EXISTS(SELECT 1 FROM sss_returns WHERE sss_returns.order_id = ${orders.id} AND sss_returns.status != 'rejected') THEN 1 ELSE 0 END)`
              .mapWith(Number),
            refundCount: sql<
              number
            >`SUM(CASE WHEN ${orders.status} = 'refunded' OR ${orders.status} = 'cancelled' OR EXISTS(SELECT 1 FROM sss_returns WHERE sss_returns.order_id = ${orders.id}) OR EXISTS(SELECT 1 FROM sss_cancellation_requests WHERE sss_cancellation_requests.order_id = ${orders.id}) THEN 1 ELSE 0 END)`
              .mapWith(Number),
          })
          .from(orders)
          .where(whereClause),
      ]);

      const total = totalResult[0].count;

      const summary = summaryResult[0] || {
        totalTransactions: 0,
        totalNominal: 0,
        completedCount: 0,
        refundCount: 0,
      };

      // Enrich with images and status override
      const orderIds = historyList.map((o) => o.id);

      const enrichedList = historyList.map((o) => ({ ...o })) as any[];

      if (orderIds.length > 0) {
        const [orderReturns, orderCancellations, allOrderItems] = await Promise.all([
          db.query.returns.findMany({ where: inArray(returns.orderId, orderIds) }),
          db.query.cancellationRequests.findMany({
            where: inArray(cancellationRequests.orderId, orderIds),
          }),
          db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds)),
        ]);

        for (const order of enrichedList) {
          const ret = orderReturns.find((r) => r.orderId === order.id);
          if (ret) {
            order.status = ret.status === 'resolved'
              ? 'refunded'
              : ret.status === 'rejected'
              ? 'return_rejected'
              : 'return_requested';
          } else {
            const cancel = orderCancellations.find((c) => c.orderId === order.id);
            if (cancel) {
              order.status = cancel.status === 'approved'
                ? 'cancelled'
                : cancel.status === 'rejected'
                ? 'cancellation_rejected'
                : 'cancellation_requested';
            }
          }

          // Attach items to the order
          order.items = allOrderItems.filter((i) => i.orderId === order.id);
        }
      }

      return c.json({
        data: {
          items: enrichedList,
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
    },
  );

export type HistoryRouteType = typeof routes;
export default routes;
