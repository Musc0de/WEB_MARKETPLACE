import { assertEquals } from '@std/assert';
import app from '../src/app.ts';
import { db, roles, supportTickets, userRoles, users, permissions, rolePermissions } from '@starsuperscare/database';
import { createSessionToken } from '@starsuperscare/auth-pkg';
import { and, eq } from 'drizzle-orm';

Deno.test('Admin Support API', async (t) => {
  let adminId: string;
  let sessionToken: string;
  let ticketId: string;

  await t.step('Setup test data', async () => {
    const suffix = Date.now().toString();
    const [u] = await db.insert(users).values({
      usernameDisplay: 'Admin Supp',
      usernameNormalized: `adminsupp_${suffix}`,
      emailDisplay: `adminsupp_${suffix}@test.com`,
      emailNormalized: `adminsupp_${suffix}@test.com`,
    }).returning();
    adminId = u.id;

    const [r1] = await db.insert(roles).values({ name: 'support.read', slug: 'support-read' }).onConflictDoUpdate({ target: roles.slug, set: { name: 'support.read' } }).returning();
    const [r2] = await db.insert(roles).values({ name: 'support.write', slug: 'support-write' }).onConflictDoUpdate({ target: roles.slug, set: { name: 'support.write' } }).returning();

    await db.insert(userRoles).values({ userId: adminId, roleId: r1.id });
    await db.insert(userRoles).values({ userId: adminId, roleId: r2.id });

    let [p1] = await db.select().from(permissions).where(and(eq(permissions.resource, 'support'), eq(permissions.action, 'read')));
    if (!p1) [p1] = await db.insert(permissions).values({ resource: 'support', action: 'read' }).returning();
    let [p2] = await db.select().from(permissions).where(and(eq(permissions.resource, 'support'), eq(permissions.action, 'write')));
    if (!p2) [p2] = await db.insert(permissions).values({ resource: 'support', action: 'write' }).returning();

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

    const [ticket] = await db.insert(supportTickets).values({
      userId: adminId,
      subject: 'Help',
      status: 'open',
      priority: 'high',
    }).returning();
    ticketId = ticket.id;
  });

  await t.step('GET /v1/admin/support/tickets - Fetch tickets', async () => {
    const req = new Request('http://localhost/v1/admin/support/tickets', {
      headers: { 'Cookie': `sss_session=${sessionToken}` },
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
  });

  await t.step('PUT /v1/admin/support/tickets/:id/status - Update ticket', async () => {
    const req = new Request(`http://localhost/v1/admin/support/tickets/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sss_session=${sessionToken}`,
      },
      body: JSON.stringify({ status: 'resolved', adminNotes: 'Resolved' }),
    });
    const res = await app.fetch(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.data.status, 'resolved');
  });

  await t.step('Cleanup', async () => {
    await db.delete(supportTickets).where(eq(supportTickets.id, ticketId));
    await db.delete(users).where(eq(users.id, adminId));
  });
});
