import { Hono } from 'hono';
import { AuthContext, optionalAuthMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const routes = app.get('/me', optionalAuthMiddleware, (c) => {
  const user = c.get('user');
  const session = c.get('session');
  const permissions = c.get('permissions') || [];

  if (!user || !session) {
    return c.json({
      data: { user: null, session: null, permissions: [] },
      error: null,
    });
  }

  return c.json({
    data: {
      user: {
        id: user.id,
        email: user.emailDisplay,
        username: user.usernameDisplay,
        status: user.status,
        emailVerified: user.emailVerifiedAt != null,
      },
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
      permissions,
    },
    error: null,
  });
});

export default routes;
