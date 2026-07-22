import { db, invoices } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
const res = await db.select().from(invoices).where(
  eq(invoices.orderId, '7d3a6152-a55c-4a9f-8ea9-ba0c5497fccb'),
);
console.log(JSON.stringify(res, null, 2));
Deno.exit(0);
