import { assert, assertEquals } from '@std/assert';
import { computeSha256 } from '../../utils/crypto.ts';
import { carts, db } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

Deno.test('Cart Module Tests (Database Integration)', async (t) => {
  await t.step(
    'should generate guest token, digest it, and insert into real database',
    async () => {
      const rawToken = crypto.randomUUID();
      const digest = await computeSha256(rawToken);

      // Test inserting a guest cart into the database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const [insertedCart] = await db.insert(carts).values({
        guestTokenHash: digest,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
      }).returning();

      assert(insertedCart.id !== undefined);
      assertEquals(insertedCart.guestTokenHash, digest);
      assertEquals(insertedCart.status, 'active');

      // Clean up
      await db.delete(carts).where(eq(carts.id, insertedCart.id));
    },
  );
});
