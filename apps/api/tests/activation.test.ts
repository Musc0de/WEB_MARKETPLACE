import { assertEquals, assertExists } from '@std/assert';
import { db, tokens, users } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import app from '../src/app.ts';
import { cleanupUser } from './auth.test.ts';

const testEmail = 'activation-test@example.com';
const testUsername = 'activation_pending';

Deno.test('Auth API: Activation Flow', async (t) => {
  await cleanupUser(testEmail);

  // 1. Create a pending user directly via DB (simulate guest or invite)
  const userRecord = await db.insert(users).values({
    emailDisplay: testEmail,
    emailNormalized: testEmail.toLowerCase(),
    usernameDisplay: testUsername,
    usernameNormalized: testUsername.toLowerCase(),
    status: 'pending_verification', // Must be activated
  }).returning().then((res) => res[0]);

  const activationToken = 'fake_activation_token_123';

  // Insert a token for activation
  await db.insert(tokens).values({
    userId: userRecord.id,
    type: 'account_activation',
    tokenHash: activationToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  await t.step('Activate account successfully', async () => {
    const req = new Request('http://localhost:8000/v1/auth/activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: activationToken,
        newPassword: 'MySecurePassword123!',
        username: 'NewUsernameTest',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 200);

    const body = await res.json();
    assertEquals(body.data.message, 'Account successfully activated');

    // Verify DB state
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userRecord.id),
    });

    assertExists(updatedUser);
    assertEquals(updatedUser.status, 'active');
    assertEquals(updatedUser.usernameNormalized, 'newusernametest');
  });

  await t.step('Re-activating should fail (token used/account active)', async () => {
    const req = new Request('http://localhost:8000/v1/auth/activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: activationToken,
        newPassword: 'AnotherPassword123!',
      }),
    });

    const res = await app.request(req);
    assertEquals(res.status, 400); // Invalid or expired activation token
  });

  await cleanupUser(testEmail);
});
