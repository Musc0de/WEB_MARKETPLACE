import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  cancellationRequests,
  db,
  inventoryReservations,
  invoices,
  orders,
  payments,
  refunds,
  returnEvents,
  returns,
  reviews,
  roles,
  shipments,
  supportMessages,
  supportTickets,
  systemAuditLogs,
  userProfiles,
  userRoles,
  users,
  voucherRedemptions,
} from '@starsuperscare/database';
import { authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

const adminCustomersRouter = new Hono();

adminCustomersRouter.use('/*', authMiddleware);
adminCustomersRouter.use('/*', requirePermission('users.read'));

adminCustomersRouter.get(
  '/',
  zValidator(
    'query',
    z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('20'),
      search: z.string().optional(),
    }),
  ),
  async (c) => {
    const { page, limit, search } = c.req.valid('query');
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    const offset = (p - 1) * l;

    let whereClause = sql`1=1`;
    if (search) {
      whereClause =
        sql`${users.emailDisplay} ILIKE ${`%${search}%`} OR ${userProfiles.fullName} ILIKE ${`%${search}%`}`;
    }

    const results = await db.select({
      id: users.id,
      email: users.emailDisplay,
      firstName: userProfiles.fullName,
      lastName: sql<string | null>`NULL`,
      status: users.status,
      createdAt: users.createdAt,
      roleName: roles.name,
      roleId: roles.id,
    })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(whereClause)
      .limit(l)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    // Per-status breakdown across ALL customers (not just current page/filter)
    const statusCountsRaw = await db.select({
      status: users.status,
      count: sql<number>`count(*)`,
    })
      .from(users)
      .groupBy(users.status);

    const statusCounts = Object.fromEntries(
      statusCountsRaw.map((r) => [r.status, Number(r.count)]),
    );

    return c.json({
      data: results,
      total,
      page: p,
      limit: l,
      statusCounts,
    });
  },
);

adminCustomersRouter.get('/roles', async (c) => {
  const allRoles = await db.select().from(roles).orderBy(roles.name);
  // Filter out permissions that were mistakenly added as roles (they usually contain dots like order.read)
  const filteredRoles = allRoles.filter((r) => !r.slug.includes('.') && !r.name.includes('.'));
  return c.json({ data: filteredRoles });
});

adminCustomersRouter.post(
  '/bulk-delete',
  zValidator(
    'json',
    z.object({
      ids: z.array(z.string().uuid()),
    }),
  ),
  async (c) => {
    const { ids } = c.req.valid('json');
    if (ids.length > 0) {
      await db.transaction(async (tx) => {
        // 1. Reviews
        await tx.delete(reviews).where(inArray(reviews.userId, ids));

        // 2. Cancellation Requests
        await tx.delete(cancellationRequests).where(inArray(cancellationRequests.userId, ids));

        // 3. Voucher Redemptions
        await tx.delete(voucherRedemptions).where(inArray(voucherRedemptions.userId, ids));

        // 4. Aftercare (Tickets and Messages)
        await tx.delete(supportMessages).where(inArray(supportMessages.senderId, ids));
        await tx.delete(supportTickets).where(inArray(supportTickets.userId, ids));
        await tx.delete(returnEvents).where(inArray(returnEvents.actorId, ids));

        // 5. Returns and Refunds
        const userReturns = await tx.select({ id: returns.id }).from(returns).where(
          inArray(returns.userId, ids),
        );
        if (userReturns.length > 0) {
          const returnIds = userReturns.map((r: any) => r.id);
          await tx.delete(refunds).where(inArray(refunds.returnId, returnIds));
        }
        await tx.delete(returns).where(inArray(returns.userId, ids));
        await tx.update(returns).set({ assignedAdminId: null }).where(
          inArray(returns.assignedAdminId, ids),
        );

        // 6. Inventory Reservations
        await tx.delete(inventoryReservations).where(inArray(inventoryReservations.userId, ids));

        // 7. Audit Logs & Stock Movements (Set to null to preserve history)
        await tx.update(systemAuditLogs).set({ actorId: null }).where(
          inArray(systemAuditLogs.actorId, ids),
        );

        // 8. Orders and Payments
        const userOrders = await tx.select({ id: orders.id }).from(orders).where(
          inArray(orders.userId, ids),
        );
        if (userOrders.length > 0) {
          const orderIds = userOrders.map((o: any) => o.id);
          await tx.delete(refunds).where(inArray(refunds.orderId, orderIds));
          await tx.delete(invoices).where(inArray(invoices.orderId, orderIds));
          await tx.delete(shipments).where(inArray(shipments.orderId, orderIds));
          await tx.delete(payments).where(inArray(payments.orderId, orderIds));
          await tx.delete(orders).where(inArray(orders.id, orderIds));
        }

        // Finally, delete users
        await tx.delete(users).where(inArray(users.id, ids));
      });
    }
    return c.json({ success: true, count: ids.length });
  },
);

adminCustomersRouter.patch(
  '/:id',
  zValidator(
    'json',
    z.object({
      status: z.string().optional(),
      roleId: z.string().uuid().nullable().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param('id');
    const { status, roleId } = c.req.valid('json');

    if (status) {
      await db.update(users).set({ status, updatedAt: new Date().toISOString() }).where(
        eq(users.id, id),
      );
    }

    if (roleId !== undefined) {
      await db.delete(userRoles).where(eq(userRoles.userId, id));
      if (roleId) {
        await db.insert(userRoles).values({ userId: id, roleId });
      }
    }

    return c.json({ success: true });
  },
);

adminCustomersRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  const userResult = await db.select({
    id: users.id,
    email: users.emailDisplay,
    firstName: userProfiles.fullName,
    lastName: sql<string | null>`NULL`,
    status: users.status,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
    lastLoginAt: users.updatedAt,
  }).from(users).leftJoin(userProfiles, eq(users.id, userProfiles.userId)).where(eq(users.id, id))
    .limit(1);

  if (!userResult.length) return c.json({ error: 'Customer not found' }, 404);
  const user = userResult[0];

  const orderStats = await db.select({
    orderCount: sql<number>`count(*)`,
    totalSpent: sql<number>`sum(${orders.totalAmount})`,
  }).from(orders).where(eq(orders.userId, id));

  return c.json({
    ...user,
    orderCount: Number(orderStats[0]?.orderCount || 0),
    totalSpent: Number(orderStats[0]?.totalSpent || 0),
  });
});

export { adminCustomersRouter };
