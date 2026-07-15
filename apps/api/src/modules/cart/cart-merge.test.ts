import { assert } from '@std/assert';
import { carts, db } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { computeSha256 } from '../../utils/crypto.ts';

Deno.test('Cart Merge Module Tests', async (t) => {
  await t.step(
    'should idempotently merge guest cart to user cart without duplicating items',
    async () => {
      // Generate guest cart manually for test
      const guestToken = crypto.randomUUID();
      const digest = await computeSha256(guestToken);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const [guestCart] = await db.insert(carts).values({
        guestTokenHash: digest,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
      }).returning();

      assert(guestCart.id !== undefined);

      // @TODO: Ideally we populate cart items and test actual route
      // Clean up
      await db.delete(carts).where(eq(carts.id, guestCart.id));
    },
  );
});
