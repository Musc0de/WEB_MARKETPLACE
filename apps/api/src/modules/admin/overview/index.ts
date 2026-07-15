import { Hono } from 'hono';
import { count, eq, isNull, sql } from 'drizzle-orm';
import { db, inventoryLevels, notifications, orders, payments } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get('/', requirePermission('orders.read'), async (c) => {
    // Metrics
    // 1. Pending orders
    const [pendingOrders] = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, 'pending'));

    // 2. Failed payments today
    const [failedPayments] = await db
      .select({ value: count() })
      .from(payments)
      .where(
        sql`${payments.status} = 'failed' AND ${payments.createdAt} >= NOW() - INTERVAL '1 DAY'`,
      );

    // 3. Low stock variants
    const [lowStock] = await db
      .select({ value: count() })
      .from(inventoryLevels)
      .where(sql`${inventoryLevels.available} < 10`);

    // 4. Pending Outbox/Emails (simulated by unread notifications for MVP)
    const [pendingEmails] = await db
      .select({ value: count() })
      .from(notifications)
      .where(isNull(notifications.readAt));

    return c.json({
      data: {
        pendingOrders: pendingOrders.value,
        failedPayments: failedPayments.value,
        lowStockVariants: lowStock.value,
        pendingEmails: pendingEmails.value,
      },
    }, 200);
  });

export default routes;
