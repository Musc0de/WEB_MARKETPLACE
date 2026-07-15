import { assertEquals, assertExists } from '@std/assert';
import { db, outboxEvents, users } from '@starsuperscare/database';
import { desc, eq } from 'drizzle-orm';
import app from '../src/app.ts';

const testEmail = 'recovery-test@example.com';
const testUsername = 'recoverytest';

// Helper to clean up
async function cleanRecoveryUser() {
  await db.delete(users).where(eq(users.emailNormalized, testEmail));
}

Deno.test('Auth API: Recovery Flow', async (t) => {
  await cleanRecoveryUser();

  // 1. Create a user
  const signupReq = new Request('http://localhost:8000/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      username: testUsername,
      password: 'StrongPassword123!',
    }),
  });
  await app.request(signupReq);

  let resetToken = '';

  await t.step('Forgot password for valid email returns generic success', async () => {
    const req = new Request('http://localhost:8000/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 200);

    const body = await res.json();
    assertEquals(body.data.message.includes('receive a password reset link'), true);

    // Fetch the token from DB (since we are integration testing and mocking email)
    const outbox = await db.query.outboxEvents.findFirst({
      orderBy: desc(outboxEvents.createdAt),
    });
    assertExists(outbox);
    assertEquals(outbox.type, 'password_reset_requested');

    // @ts-ignore: Intentionally passing invalid body for test
    resetToken = outbox.payload.token;
  });

  await t.step('Forgot password for unknown email returns same generic success', async () => {
    const req = new Request('http://localhost:8000/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@example.com' }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 200); // 200 OK to prevent enumeration!
  });

  await t.step('Reset password with valid token', async () => {
    const req = new Request('http://localhost:8000/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: 'NewStrongPassword123!',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 200);
  });

  await t.step('Reset password with reused token should fail', async () => {
    const req = new Request('http://localhost:8000/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: 'AnotherPassword123!',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 400); // Bad Request because token is used
  });

  await cleanRecoveryUser();
});
