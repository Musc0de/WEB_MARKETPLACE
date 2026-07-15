import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import { db, orderItems, orders, returns, users, roles, rolePermissions, permissions, userRoles, stores, products, productVariants } from '@starsuperscare/database';
import { createSessionToken } from '@starsuperscare/auth-pkg';
import { and, eq } from 'drizzle-orm';

Deno.test('Admin Returns API', async (t) => {
  let adminId: string;
  let sessionToken: string;
  let orderId: string;
  let returnId: string;

  await t.step('Setup test data', async () => {
    const suffix = Date.now().toString();
    const [u] = await db.insert(users).values({
      usernameDisplay: 'Admin Return',
      usernameNormalized: `adminreturn_${suffix}`,
      emailDisplay: `adminreturn_${suffix}@test.com`,
      emailNormalized: `adminreturn_${suffix}@test.com`,
    }).returning();
    adminId = u.id;

    // Give orders.read, orders.write
    let [r1] = await db.select().from(roles).where(eq(roles.name, 'admin'));
    if (!r1) [r1] = await db.insert(roles).values({ name: 'admin', slug: 'admin', description: 'Admin' }).onConflictDoUpdate({ target: roles.slug, set: { name: 'admin' } }).returning();
    let [r2] = await db.select().from(roles).where(eq(roles.name, 'support'));
    if (!r2) [r2] = await db.insert(roles).values({ name: 'support', slug: 'support', description: 'Support' }).onConflictDoUpdate({ target: roles.slug, set: { name: 'support' } }).returning();

    const [ur1] = await db.select().from(userRoles).where(and(eq(userRoles.userId, adminId), eq(userRoles.roleId, r1.id)));
    if (!ur1) await db.insert(userRoles).values({ userId: adminId, roleId: r1.id });

    let [p1] = await db.select().from(permissions).where(and(eq(permissions.resource, 'orders'), eq(permissions.action, 'read')));
    if (!p1) [p1] = await db.insert(permissions).values({ resource: 'orders', action: 'read' }).returning();
    let [p2] = await db.select().from(permissions).where(and(eq(permissions.resource, 'orders'), eq(permissions.action, 'write')));
    if (!p2) [p2] = await db.insert(permissions).values({ resource: 'orders', action: 'write' }).returning();

    const [rp1] = await db.select().from(rolePermissions).where(and(eq(rolePermissions.roleId, r1.id), eq(rolePermissions.permissionId, p1.id)));
    if (!rp1) await db.insert(rolePermissions).values({ roleId: r1.id, permissionId: p1.id });
    const [rp2] = await db.select().from(rolePermissions).where(and(eq(rolePermissions.roleId, r2.id), eq(rolePermissions.permissionId, p2.id)));
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
      orderNumber: `ORD-ADMRET-${suffix}`,
      emailSnapshot: `adminreturn_${suffix}@test.com`,
      totalAmount: 1000,
      subtotalAmount: 1000,
      status: 'delivered',
    }).returning();
    orderId = o.id;

    const [st] = await db.insert(stores).values({
      name: `Admin Ret Store ${suffix}`,
      slug: `adm-ret-store-${suffix}`,
    }).returning();

    const [p] = await db.insert(products).values({
      name: 'Admin Return Product',
      slug: `adm-ret-prod-${suffix}`,
      type: 'physical',
      storeId: st.id,
      status: 'active',
    }).returning();

    const [v] = await db.insert(productVariants).values({
      productId: p.id,
      sku: `sku-admret-${suffix}`,
      price: 1000,
    }).returning();

    await db.insert(orderItems).values({
      orderId,
      productId: p.id,
      variantId: v.id,
      quantity: 1,
      priceSnapshot: 1000,
      productNameSnapshot: 'Test',
      variantSkuSnapshot: 'SKU',
    });

    const [ret] = await db.insert(returns).values({
      userId: adminId,
      orderId,
      reason: 'wrong_item',
      resolution: 'refund',
      status: 'pending',
    }).returning();
    returnId = ret.id;
  });

  await t.step('GET /v1/admin/returns - Fetch returns', async () => {
    const req = new Request('http://localhost/v1/admin/returns', {
      headers: { 'Cookie': `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(typeof body.data.length, 'number');
  });

  await t.step('PUT /v1/admin/returns/:id/status - Process return', async () => {
    const req = new Request(`http://localhost/v1/admin/returns/${returnId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({ status: 'approved', adminNotes: 'Approved' }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.status, 'approved');
  });

  await t.step('Cleanup', async () => {
    await db.delete(returns).where(eq(returns.orderId, orderId));
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
    await db.delete(orders).where(eq(orders.id, orderId));
    await db.delete(users).where(eq(users.id, adminId));
  });
});
