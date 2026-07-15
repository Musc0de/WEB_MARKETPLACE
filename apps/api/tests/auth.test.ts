import { assertEquals, assertExists } from '@std/assert';
import app from '../src/app.ts';
import { db, tokens, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

// Helper to cleanup user
export async function cleanupUser(email: string) {
  await db.delete(users).where(eq(users.emailNormalized, email));
}

Deno.test('Auth API: Signup and Verify Flow', async (t) => {
  const testEmail = 'testsignup123@example.com';
  const testUsername = 'testsignup123';

  await cleanupUser(testEmail);

  await t.step('Signup valid user', async () => {
    const req = new Request('http://localhost:8000/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        email: testEmail,
        password: 'ValidPassword123!',
        fullName: 'Test User',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 201);

    const body = await res.json();
    assertEquals(body.data.user.email, testEmail);
    assertEquals(body.data.user.status, 'pending_verification');
  });

  await t.step('Signup duplicate email should fail', async () => {
    const req = new Request('http://localhost:8000/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'different_username',
        email: testEmail,
        password: 'ValidPassword123!',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 409);
  });

  await t.step('Verify email with valid token', async () => {
    // Manually fetch the token from DB
    const user = await db.query.users.findFirst({
      where: eq(users.emailNormalized, testEmail),
    });
    assertExists(user);

    const tokenRecord = await db.query.tokens.findFirst({
      where: eq(tokens.userId, user.id),
    });
    assertExists(tokenRecord);

    const req = new Request('http://localhost:8000/v1/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokenRecord.tokenHash,
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 200);

    const body = await res.json();
    assertEquals(body.data.status, 'active');
  });

  await t.step('Verify email with used token should fail', async () => {
    // Manually fetch the token from DB
    const user = await db.query.users.findFirst({
      where: eq(users.emailNormalized, testEmail),
    });
    assertExists(user);

    const tokenRecord = await db.query.tokens.findFirst({
      where: eq(tokens.userId, user.id),
    });
    assertExists(tokenRecord);

    const req = new Request('http://localhost:8000/v1/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokenRecord.tokenHash,
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 400); // Because token is already marked used
  });

  await t.step('Login with valid credentials', async () => {
    const req = new Request('http://localhost:8000/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: 'ValidPassword123!',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 200);

    const body = await res.json();
    assertEquals(body.data.message, 'Login successful');

    // Check cookie
    const cookies = res.headers.get('set-cookie');
    assertExists(cookies);
    assertEquals(cookies.includes('sss_session='), true);
  });

  await t.step('Login with invalid password should fail', async () => {
    const req = new Request('http://localhost:8000/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: 'WrongPassword!',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 401);
  });

  await t.step('Logout with session cookie', async () => {
    // 1. Login to get token
    const loginReq = new Request('http://localhost:8000/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: 'ValidPassword123!',
      }),
    });
    const loginRes = await app.request(loginReq);
    const cookies = loginRes.headers.get('set-cookie');
    assertExists(cookies);

    // Extract raw token from Set-Cookie: sss_session=...; Path=/; Secure; HttpOnly; SameSite=Lax
    const tokenMatch = cookies.match(/sss_session=([^;]+)/);
    assertExists(tokenMatch);
    const rawToken = tokenMatch[1];

    // 2. Logout
    const logoutReq = new Request('http://localhost:8000/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Cookie': `sss_session=${rawToken}`,
      },
    });

    const logoutRes = await app.request(logoutReq);
    assertEquals(logoutRes.status, 200);
  });

  await t.step('Access logout without session should fail', async () => {
    const logoutReq = new Request('http://localhost:8000/v1/auth/logout', {
      method: 'POST',
    });
    const logoutRes = await app.request(logoutReq);
    assertEquals(logoutRes.status, 401);
  });

  // Cleanup
  await cleanupUser(testEmail);
});
