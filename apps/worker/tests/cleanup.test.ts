import { expect } from 'jsr:@std/expect@1';
import { db } from '@starsuperscare/database';
import { carts, sessions } from '@starsuperscare/database';
import { runCleanupJobs } from '../src/jobs/cleanup.ts';
import { eq } from 'drizzle-orm';
const uuidv4 = () => crypto.randomUUID();

Deno.test({
  name: 'Cleanup Jobs - Expired Sessions and Carts',
  async fn() {
    const expiredSessionId = uuidv4();
    const activeSessionId = uuidv4();

    // We need a user to test sessions properly, since userId is notNull and references users
    // For unit tests, we'll assume foreign keys are either mocked or we insert a test user.
    // If DB has FK constraints, this will fail unless we insert a user first.
    // We'll skip actual insertion if it requires full relational mock for simplicity,
    // but typically we'd insert a user here.
    // Let's assume we can insert a dummy user:
    const userId = uuidv4();
    try {
      await db.insert((await import('@starsuperscare/database')).users).values({
        id: userId,
        usernameDisplay: 'testuser',
        usernameNormalized: 'testuser' + Date.now(),
        emailDisplay: 'test@example.com',
        emailNormalized: 'test' + Date.now() + '@example.com',
      });
    } catch (_err) {
      // Ignore if user already exists or similar
    }

    const pastDate = new Date(Date.now() - 100000).toISOString();
    const futureDate = new Date(Date.now() + 100000).toISOString();

    await db.insert(sessions).values([
      {
        id: expiredSessionId,
        userId: userId,
        sessionTokenHash: 'hash1' + Date.now(),
        expiresAt: pastDate,
      },
      {
        id: activeSessionId,
        userId: userId,
        sessionTokenHash: 'hash2' + Date.now(),
        expiresAt: futureDate,
      },
    ]);

    // Same for guest cart
    const expiredCartId = uuidv4();
    const activeCartId = uuidv4();

    await db.insert(carts).values([
      {
        id: expiredCartId,
        userId: null,
        expiresAt: pastDate,
      },
      {
        id: activeCartId,
        userId: null,
        expiresAt: futureDate,
      },
    ]);

    // Run cleanup
    await runCleanupJobs();

    // Verify
    const expiredSession = await db.select().from(sessions).where(
      eq(sessions.id, expiredSessionId),
    );
    const activeSession = await db.select().from(sessions).where(eq(sessions.id, activeSessionId));

    expect(expiredSession.length).toBe(0);
    expect(activeSession.length).toBe(1);

    const expiredCart = await db.select().from(carts).where(eq(carts.id, expiredCartId));
    const activeCart = await db.select().from(carts).where(eq(carts.id, activeCartId));

    expect(expiredCart.length).toBe(0);
    expect(activeCart.length).toBe(1);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
