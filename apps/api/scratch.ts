import { db, payments } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
const res = await db.select().from(payments).where(
  eq(payments.orderId, '0fc3172a-b7bb-4ca9-bf93-b8f08d9809ea'),
);
console.log(JSON.stringify(res, null, 2));
Deno.exit(0);
