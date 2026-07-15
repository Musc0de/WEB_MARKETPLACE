import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { securityAuditLogs, sessions, withTransaction } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const logoutRouter = new Hono<AuthContext>();

const routes = logoutRouter
  .use('/', authMiddleware)
  .post('/', async (c) => {
    const session = c.get('session');
    const user = c.get('user');
    const ipHash = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || null;

    await withTransaction(async (tx) => {
      // Revoke session
      await tx.update(sessions)
        .set({ revokedAt: new Date().toISOString() })
        .where(eq(sessions.id, session.id));

      // Audit log
      await tx.insert(securityAuditLogs).values({
        userId: user.id,
        event: 'logout',
        ipHash,
        userAgent,
      });
    });

    // Clear cookie
    deleteCookie(c, 'sss_session', {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
    });

    return c.json({
      data: {
        message: 'Logout successful',
      },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  });

export default routes;
