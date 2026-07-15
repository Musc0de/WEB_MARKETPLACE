import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, loginAttempts, passwordCredentials, sessions } from '@starsuperscare/database';
import { and, desc, eq, isNull, ne } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';
import { hashPassword, validatePasswordStrength, verifyPassword } from '@starsuperscare/auth-pkg';

const app = new Hono<AuthContext>();

const routes = app
  .use('*', authMiddleware)
  .patch(
    '/password',
    zValidator(
      'json',
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(1),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { currentPassword, newPassword } = c.req.valid('json');

      const [cred] = await db
        .select()
        .from(passwordCredentials)
        .where(eq(passwordCredentials.userId, user.id))
        .limit(1);

      if (!cred) {
        throw new HTTPException(400, { message: 'User does not have a password set up' });
      }

      const isValid = await verifyPassword(cred.passwordHash, currentPassword);
      if (!isValid) {
        throw new HTTPException(400, { message: 'Incorrect current password' });
      }

      if (!validatePasswordStrength(newPassword)) {
        throw new HTTPException(400, {
          message: 'New password does not meet strength requirements',
        });
      }

      const newHash = await hashPassword(newPassword);

      await db
        .update(passwordCredentials)
        .set({
          passwordHash: newHash,
          passwordChangedAt: new Date().toISOString(),
          hashVersion: (cred.hashVersion || 1) + 1,
        })
        .where(eq(passwordCredentials.userId, user.id));

      return c.json({
        data: { success: true },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    },
  )
  .get('/sessions', async (c) => {
    const user = c.get('user');

    // Get active sessions
    const activeSessions = await db
      .select({
        id: sessions.id,
        userAgent: sessions.userAgent,
        ipHash: sessions.ipHash,
        lastSeenAt: sessions.lastSeenAt,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
        isCurrent: eq(sessions.id, c.get('session').id),
      })
      .from(sessions)
      .where(and(eq(sessions.userId, user.id), isNull(sessions.revokedAt)))
      .orderBy(desc(sessions.lastSeenAt));

    // Get recent login attempts (last 10)
    const recentLogins = await db
      .select()
      .from(loginAttempts)
      .where(eq(loginAttempts.email, user.emailNormalized))
      .orderBy(desc(loginAttempts.attemptedAt))
      .limit(10);

    return c.json({
      data: { sessions: activeSessions, loginAttempts: recentLogins },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .delete('/sessions/:id', async (c) => {
    const user = c.get('user');
    const sessionId = c.req.param('id');
    const currentSessionId = c.get('session').id;

    if (sessionId === currentSessionId) {
      throw new HTTPException(400, {
        message: 'Cannot revoke current active session using this endpoint. Use logout instead.',
      });
    }

    const [session] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, user.id)))
      .limit(1);

    if (!session) {
      throw new HTTPException(404, { message: 'Session not found' });
    }

    await db
      .update(sessions)
      .set({ revokedAt: new Date().toISOString() })
      .where(eq(sessions.id, sessionId));

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  })
  .delete('/sessions', async (c) => {
    const user = c.get('user');
    const currentSessionId = c.get('session').id;

    // Revoke all OTHER sessions
    await db
      .update(sessions)
      .set({ revokedAt: new Date().toISOString() })
      .where(and(eq(sessions.userId, user.id), ne(sessions.id, currentSessionId)));

    return c.json({
      data: { success: true },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
