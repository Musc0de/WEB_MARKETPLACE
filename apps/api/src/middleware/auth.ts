import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import {
  db,
  permissions,
  rolePermissions,
  roles,
  sessions,
  userRoles,
  users,
} from '@starsuperscare/database';
import { hashSessionToken } from '@starsuperscare/auth-pkg';
import { and, eq, gt, isNull } from 'drizzle-orm';

export type AuthContext = {
  Variables: {
    user: typeof users.$inferSelect;
    session: typeof sessions.$inferSelect;
    permissions: string[];
    requestId: string;
  };
};

export async function authMiddleware(c: Context<AuthContext>, next: Next) {
  let rawToken = getCookie(c, 'sss_session');

  if (!rawToken) {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      rawToken = authHeader.slice(7);
    }
  }

  if (!rawToken) {
    throw new HTTPException(401, { message: 'Unauthorized: No session token provided' });
  }

  const tokenHash = await hashSessionToken(rawToken);

  const result = await db.select({
    session: sessions,
    user: users,
  })
    .from(sessions)
    .leftJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.sessionTokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date().toISOString()),
      ),
    )
    .limit(1);

  const session = result[0]?.session;
  const userRecord = result[0]?.user;

  if (!session || !userRecord) {
    throw new HTTPException(401, { message: 'Unauthorized: Invalid or expired session' });
  }

  if (userRecord.status === 'suspended' || userRecord.status === 'banned') {
    throw new HTTPException(403, { message: 'Forbidden: User account is suspended or banned' });
  }

  const perms = await db.select({ action: permissions.action, resource: permissions.resource })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userRecord.id));

  const userPermissions = perms.map((p) => `${p.resource}.${p.action}`);

  const user = userRecord as typeof users.$inferSelect;

  c.set('user', user);
  c.set('session', session as typeof sessions.$inferSelect);
  c.set('permissions', userPermissions);

  const lastSeen = session.lastSeenAt ? new Date(session.lastSeenAt).getTime() : 0;
  const now = Date.now();
  if (now - lastSeen > 5 * 60 * 1000) {
    db.update(sessions)
      .set({ lastSeenAt: new Date().toISOString() })
      .where(eq(sessions.id, session.id))
      .execute()
      .catch((err) => console.error('Failed to update lastSeenAt:', err));
  }

  await next();
}

export const requirePermission = (requiredPermission: string) => {
  return async (c: Context<AuthContext>, next: Next) => {
    const user = c.get('user');
    const userPermissions = c.get('permissions') || [];

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    if (user.usernameNormalized === 'superadmin') {
      return await next();
    }

    if (!userPermissions.includes(requiredPermission)) {
      throw new HTTPException(403, {
        message: `Insufficient permissions: missing ${requiredPermission}`,
      });
    }

    await next();
  };
};

export async function optionalAuthMiddleware(c: Context<AuthContext>, next: Next) {
  try {
    // 1. Get raw token
    let rawToken = getCookie(c, 'sss_session');
    if (!rawToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        rawToken = authHeader.slice(7);
      }
    }

    if (!rawToken) {
      return await next();
    }

    // 2. Hash token
    const tokenHash = await hashSessionToken(rawToken);

    // 3. Find session
    const result = await db.select({
      session: sessions,
      user: users,
    })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .where(
        and(
          eq(sessions.sessionTokenHash, tokenHash),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, new Date().toISOString()),
        ),
      )
      .limit(1);

    const session = result[0]?.session;
    const userRecord = result[0]?.user;

    if (
      session && userRecord && userRecord.status !== 'suspended' && userRecord.status !== 'banned'
    ) {
      const perms = await db.select({ action: permissions.action, resource: permissions.resource })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(userRoles.userId, userRecord.id));

      const userPermissions = perms.map((p) => `${p.resource}.${p.action}`);

      c.set('user', userRecord as any);
      c.set('session', session as any);
      c.set('permissions', userPermissions);

      // Optionally update lastSeenAt
      const lastSeen = session.lastSeenAt ? new Date(session.lastSeenAt).getTime() : 0;
      const now = Date.now();
      if (now - lastSeen > 5 * 60 * 1000) {
        db.update(sessions)
          .set({ lastSeenAt: new Date().toISOString() })
          .where(eq(sessions.id, session.id))
          .execute()
          .catch((err) => console.error('Failed to update lastSeenAt:', err));
      }
    }
  } catch (err) {
    // Ignore errors for optional auth
    console.error('Optional auth error', err);
  }

  await next();
}
