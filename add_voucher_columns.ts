import { db } from './packages/database/src/index.ts';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`ALTER TABLE "sss_vouchers" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active' NOT NULL`);
  await db.execute(sql`ALTER TABLE "sss_vouchers" ADD COLUMN IF NOT EXISTS "description" text`);
  console.log('Columns added successfully');
  Deno.exit(0);
}
main();
