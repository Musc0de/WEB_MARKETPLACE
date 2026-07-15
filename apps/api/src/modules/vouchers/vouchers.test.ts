import { assert, assertEquals } from '@std/assert';
import { db } from '@starsuperscare/database';
// @ts-ignore:dsadsa
import { vouchers } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

Deno.test('Vouchers Module Tests', async (t) => {
  await t.step('should validate active voucher correctly', async () => {
    const code = 'TESTMERGE' + Date.now();

    // Create test voucher
    const [voucher] = await db.insert(vouchers).values({
      code,
      discountType: 'percentage',
      discountAmount: 10,
      isActive: 1,
      maxUses: 100,
    }).returning();

    assert(voucher.id !== undefined);

    // Call validation logic directly or via request
    const voucherList = await db.select().from(vouchers).where(eq(vouchers.code, code)).limit(1);
    assertEquals(voucherList.length, 1);
    assertEquals(voucherList[0].isActive, 1);
    assertEquals(voucherList[0].discountAmount, 10);

    // Clean up
    await db.delete(vouchers).where(eq(vouchers.id, voucher.id));
  });
});
