import { Hono } from 'hono';
import { and, eq, isNull, notInArray, sql } from 'drizzle-orm';
import { db, invoices, notifications, orders } from '@starsuperscare/database';
import { type AuthContext, authMiddleware } from '../../middleware/auth.ts';

const home = new Hono<AuthContext>();

// Apply auth middleware to all dashboard home routes
home.use('*', authMiddleware);

const routes = home.get('/', async (c) => {
  const userId = c.get('user').id;

  // 1. Active orders count: status is NOT 'delivered', 'cancelled', 'refunded'
  const activeOrdersQuery = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        notInArray(orders.status, ['delivered', 'cancelled', 'refunded']),
      ),
    );
  const activeOrders = activeOrdersQuery[0].count;

  // 2. Total purchases: sum of totalAmount for orders that are 'paid', 'processing', 'shipped', 'delivered'
  const totalPurchasesQuery = await db
    .select({ total: sql<number>`coalesce(sum(${orders.totalAmount}), 0)` })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        notInArray(orders.status, ['pending', 'cancelled', 'refunded']),
      ),
    );
  const totalPurchases = Number(totalPurchasesQuery[0].total);

  // 3. Unread notifications
  const unreadNotifsQuery = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        isNull(notifications.readAt),
      ),
    );
  const unreadNotifications = unreadNotifsQuery[0].count;

  // 4. Unpaid invoices status
  // Join invoices with orders to ensure it belongs to the user
  const unpaidInvoicesQuery = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(invoices)
    .innerJoin(orders, eq(invoices.orderId, orders.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(invoices.status, 'unpaid'),
      ),
    );
  const hasUnpaidInvoices = unpaidInvoicesQuery[0].count > 0;

  // 5. Latest 3 active orders for quick view
  const latestOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        notInArray(orders.status, ['cancelled', 'refunded']),
      ),
    )
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(3);

  return c.json({
    data: {
      summary: {
        activeOrders,
        totalPurchases,
        unreadNotifications,
        hasUnpaidInvoices,
      },
      latestOrders,
    },
  });
});

export { routes as home };
