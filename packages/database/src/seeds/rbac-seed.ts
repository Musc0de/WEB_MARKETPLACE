// Seed RBAC
import { db } from '../db.ts';
import {
  passwordCredentials,
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from '../schema/index.ts';
import { and, eq } from 'drizzle-orm';
import { hashPassword } from '@starsuperscare/auth-pkg';

async function seedRBAC() {
  console.log('Seeding RBAC roles and permissions...');

  // 1. Define required granular permissions
  const requiredPermissions = [
    { action: 'read', resource: 'catalog', description: 'Can view catalog data' },
    { action: 'write', resource: 'catalog', description: 'Can create and update catalog data' },
    {
      action: 'publish',
      resource: 'catalog',
      description: 'Can publish and unpublish catalog data',
    },
    { action: 'adjust', resource: 'inventory', description: 'Can adjust inventory levels' },
    { action: 'manage', resource: 'order', description: 'Can manage orders' },
    { action: 'manage', resource: 'refund', description: 'Can manage refunds' },
    { action: 'manage', resource: 'support', description: 'Can manage support tickets' },
  ];

  const insertedPermissions = [];
  for (const p of requiredPermissions) {
    const existing = await db.select().from(permissions)
      .where(and(eq(permissions.action, p.action), eq(permissions.resource, p.resource)))
      .limit(1);

    if (existing.length === 0) {
      const inserted = await db.insert(permissions).values(p).returning();
      insertedPermissions.push(inserted[0]);
    } else {
      insertedPermissions.push(existing[0]);
    }
  }

  // 2. Create 'admin' role
  let adminRole = await db.select().from(roles).where(eq(roles.slug, 'admin')).limit(1).then((
    res,
  ) => res[0]);
  if (!adminRole) {
    const res = await db.insert(roles).values({
      name: 'Administrator',
      slug: 'admin',
      description: 'Super user with full access',
      isSystem: true,
    }).returning();
    adminRole = res[0];
  }

  // 3. Link permissions to 'admin' role
  for (const p of insertedPermissions) {
    const existingLink = await db.select().from(rolePermissions)
      .where(and(eq(rolePermissions.roleId, adminRole.id), eq(rolePermissions.permissionId, p.id)))
      .limit(1);

    if (existingLink.length === 0) {
      await db.insert(rolePermissions).values({
        roleId: adminRole.id,
        permissionId: p.id,
      });
    }
  }

  // 4. Create an admin user if not exists
  const adminEmail = 'admin@starsuperscare.com';
  let adminUser = await db.select().from(users).where(eq(users.emailNormalized, adminEmail)).limit(
    1,
  ).then((res) => res[0]);

  if (!adminUser) {
    const hash = await hashPassword('SuperScare123!');
    const res = await db.insert(users).values({
      emailDisplay: adminEmail,
      emailNormalized: adminEmail,
      usernameDisplay: 'SuperAdmin',
      usernameNormalized: 'superadmin',
      status: 'active',
      emailVerifiedAt: new Date().toISOString(),
    }).returning();
    adminUser = res[0];

    await db.insert(passwordCredentials).values({
      userId: adminUser.id,
      passwordHash: hash,
    });
  }

  // Link user to role
  const existingUserRole = await db.select().from(userRoles)
    .where(and(eq(userRoles.userId, adminUser.id), eq(userRoles.roleId, adminRole.id)))
    .limit(1);

  if (existingUserRole.length === 0) {
    await db.insert(userRoles).values({
      userId: adminUser.id,
      roleId: adminRole.id,
    });
  }

  console.log('RBAC Seeding Complete!');
}

if (import.meta.main) {
  seedRBAC()
    .then(() => Deno.exit(0))
    .catch((err) => {
      console.error(err);
      Deno.exit(1);
    });
}
