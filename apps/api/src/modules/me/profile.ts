import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, userProfiles, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .get('/', async (c) => {
    const user = c.get('user');
    const [profile] = await db
      .select({
        id: users.id,
        email: users.emailDisplay,
        username: users.usernameDisplay,
        status: users.status,
        joinedAt: users.createdAt,
        fullName: userProfiles.fullName,
        phone: userProfiles.phone,
        avatarObjectKey: userProfiles.avatarObjectKey,
        locale: userProfiles.locale,
        timezone: userProfiles.timezone,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, user.id))
      .limit(1);

    return c.json({
      data: profile,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .patch(
    '/',
    zValidator(
      'json',
      z.object({
        fullName: z.string().optional(),
        phone: z.string().optional(),
        avatarObjectKey: z.string().optional(),
        locale: z.string().optional(),
        timezone: z.string().optional(),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const data = c.req.valid('json');

      const updated = await db.transaction(async (tx) => {
        // Upsert logic for profile
        const [existing] = await tx.select().from(userProfiles).where(
          eq(userProfiles.userId, user.id),
        );
        if (!existing) {
          await tx.insert(userProfiles).values({
            userId: user.id,
            ...(data.fullName !== undefined && { fullName: data.fullName }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.avatarObjectKey !== undefined && { avatarObjectKey: data.avatarObjectKey }),
            ...(data.locale !== undefined && { locale: data.locale }),
            ...(data.timezone !== undefined && { timezone: data.timezone }),
          });
        } else {
          // Filter out undefined properties using Object.fromEntries to avoid Drizzle complaining
          const toUpdate = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined),
          );
          if (Object.keys(toUpdate).length > 0) {
            await tx.update(userProfiles).set(toUpdate).where(eq(userProfiles.userId, user.id));
          }
        }

        const [profile] = await tx
          .select({
            id: users.id,
            email: users.emailDisplay,
            username: users.usernameDisplay,
            status: users.status,
            joinedAt: users.createdAt,
            fullName: userProfiles.fullName,
            phone: userProfiles.phone,
            avatarObjectKey: userProfiles.avatarObjectKey,
            locale: userProfiles.locale,
            timezone: userProfiles.timezone,
          })
          .from(users)
          .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
          .where(eq(users.id, user.id))
          .limit(1);

        return profile;
      });

      return c.json({
        data: updated,
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  );

export default routes;
