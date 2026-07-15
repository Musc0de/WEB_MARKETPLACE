// tests
import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import {
  db,
  permissions,
  rolePermissions,
  roles,
  sessions,
  userRoles,
  users,
} from '@starsuperscare/database';
import { createSessionToken } from '@starsuperscare/auth-pkg';
import { and, eq } from 'drizzle-orm';

async function createSession(userId: string) {
  const { raw, hash } = await createSessionToken();
  await db.insert(sessions).values({
    userId,
    sessionTokenHash: hash,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days
  });
  return { sessionToken: raw };
}

const testUsername = 'test_rbac_user';
const testEmail = 'rbac_user@example.com';

const staffEmail = 'staff@example.com';

async function cleanupUser(email: string) {
  const existing = await db.select().from(users).where(eq(users.emailNormalized, email)).limit(1);
  if (existing.length > 0) {
    await db.delete(users).where(eq(users.id, existing[0].id));
  }
}

async function setupUserWithRole(email: string, roleName: string, perms: string[]) {
  await cleanupUser(email);

  // create user
  const [user] = await db.insert(users).values({
    emailDisplay: email,
    emailNormalized: email,
    usernameDisplay: email.split('@')[0],
    usernameNormalized: email.split('@')[0],
    status: 'active',
  }).returning();

  // create role
  let [role] = await db.select().from(roles).where(eq(roles.slug, roleName)).limit(1);
  if (!role) {
    [role] = await db.insert(roles).values({
      name: roleName,
      slug: roleName,
    }).returning();
  }

  // link role
  await db.insert(userRoles).values({ userId: user.id, roleId: role.id });

  // link permissions
  for (const permStr of perms) {
    const [resource, action] = permStr.split('.');
    let [perm] = await db.select().from(permissions).where(
      and(eq(permissions.action, action), eq(permissions.resource, resource)),
    ).limit(1);
    if (!perm) {
      [perm] = await db.insert(permissions).values({ action, resource }).returning();
    }

    const existingLink = await db.select().from(rolePermissions)
      .where(and(eq(rolePermissions.roleId, role.id), eq(rolePermissions.permissionId, perm.id)))
      .limit(1);
    if (existingLink.length === 0) {
      await db.insert(rolePermissions).values({ roleId: role.id, permissionId: perm.id });
    }
  }

  return user;
}

Deno.test({
  name: 'Admin RBAC Default Deny',
  async fn(t) {
    await t.step('Unauthenticated request to admin endpoint returns 401', async () => {
      const res = await app.request('/v1/admin/catalog/products', {
        method: 'POST',
      });
      assertEquals(res.status, 401);
    });

    await t.step('Customer (no roles) returns 403 Forbidden', async () => {
      await cleanupUser(testEmail);
      const [user] = await db.insert(users).values({
        emailDisplay: testEmail,
        emailNormalized: testEmail,
        usernameDisplay: testUsername,
        usernameNormalized: testUsername,
        status: 'active',
      }).returning();

      const { sessionToken } = await createSession(user.id);

      const res = await app.request('/v1/admin/catalog/products', {
        method: 'POST',
        headers: {
          'Cookie': `sss_session=${sessionToken}`,
        },
      });
      assertEquals(res.status, 403);
    });

    await t.step('Staff with catalog.read but NO catalog.write returns 403', async () => {
      const staffUser = await setupUserWithRole(staffEmail, 'staff', ['catalog.read']);
      const { sessionToken } = await createSession(staffUser.id);

      const res = await app.request('/v1/admin/catalog/products', {
        method: 'POST',
        headers: {
          'Cookie': `sss_session=${sessionToken}`,
        },
      });
      assertEquals(res.status, 403);
    });
  },
});
