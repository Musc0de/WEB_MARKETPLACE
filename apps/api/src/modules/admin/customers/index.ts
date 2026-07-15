import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, orders, userProfiles, users } from '@starsuperscare/database';
import { authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { desc, eq, sql } from 'drizzle-orm';
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
    })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(whereClause)
      .limit(l)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);

    return c.json({
      data: results,
      total,
      page: p,
      limit: l,
    });
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
