import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import {
  db,
  orders,
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from '@starsuperscare/database';
import { createSessionToken } from '@starsuperscare/auth-pkg';
import { and, eq } from 'drizzle-orm';

Deno.test('Admin Orders API', async (t) => {
  let adminId: string;
  let sessionToken: string;
  let orderId: string;

  await t.step('Setup test data', async () => {
    const suffix = Date.now().toString();
    const [u] = await db.insert(users).values({
      usernameDisplay: 'Admin Order',
      usernameNormalized: `adminorder_${suffix}`,
      emailDisplay: `adminorder_${suffix}@test.com`,
      emailNormalized: `adminorder_${suffix}@test.com`,
    }).returning();
    adminId = u.id;

    // Give orders.read, orders.write
    const [r1] = await db.insert(roles).values({ name: 'orders.read', slug: 'orders-read' })
      .onConflictDoUpdate({ target: roles.slug, set: { name: 'orders.read' } }).returning();
    const [r2] = await db.insert(roles).values({ name: 'orders.write', slug: 'orders-write' })
      .onConflictDoUpdate({ target: roles.slug, set: { name: 'orders.write' } }).returning();

    await db.insert(userRoles).values({ userId: adminId, roleId: r1.id });
    await db.insert(userRoles).values({ userId: adminId, roleId: r2.id });

    let [p1] = await db.select().from(permissions).where(
      and(eq(permissions.resource, 'orders'), eq(permissions.action, 'read')),
    );
    if (!p1) {
      [p1] = await db.insert(permissions).values({ resource: 'orders', action: 'read' })
        .returning();
    }
    let [p2] = await db.select().from(permissions).where(
      and(eq(permissions.resource, 'orders'), eq(permissions.action, 'write')),
    );
    if (!p2) {
      [p2] = await db.insert(permissions).values({ resource: 'orders', action: 'write' })
        .returning();
    }

    // Check if role-permission exists
    const [rp1] = await db.select().from(rolePermissions).where(
      and(eq(rolePermissions.roleId, r1.id), eq(rolePermissions.permissionId, p1.id)),
    );
    if (!rp1) await db.insert(rolePermissions).values({ roleId: r1.id, permissionId: p1.id });
    const [rp2] = await db.select().from(rolePermissions).where(
      and(eq(rolePermissions.roleId, r2.id), eq(rolePermissions.permissionId, p2.id)),
    );
    if (!rp2) await db.insert(rolePermissions).values({ roleId: r2.id, permissionId: p2.id });

    const tokenRes = await createSessionToken();
    sessionToken = tokenRes.raw;
    await db.insert(db._.fullSchema.sessions).values({
      userId: adminId,
      sessionTokenHash: tokenRes.hash,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const [o] = await db.insert(orders).values({
      userId: adminId,
      orderNumber: 'ORD-ADMIN',
      emailSnapshot: 'adminorder@test.com',
      totalAmount: 1000,
      subtotalAmount: 1000,
      status: 'pending',
    }).returning();
    orderId = o.id;
  });

  await t.step('GET /v1/admin/orders - Fetch orders', async () => {
    const req = new Request('http://localhost/v1/admin/orders', {
      headers: { 'Cookie': `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(typeof body.data.length, 'number');
  });

  await t.step('GET /v1/admin/orders/:id - Fetch order details', async () => {
    const req = new Request(`http://localhost/v1/admin/orders/${orderId}`, {
      headers: { 'Cookie': `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
  });

  await t.step('POST /v1/admin/orders/:id/status - Update order status', async () => {
    const req = new Request(`http://localhost/v1/admin/orders/${orderId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({ status: 'paid' }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.status, 'paid');
  });

  await t.step('Cleanup', async () => {
    await db.delete(orders).where(eq(orders.id, orderId));
    await db.delete(users).where(eq(users.id, adminId));
  });
});
