import { db } from './packages/database/src/index.ts';
import { sql } from 'drizzle-orm';

async function run() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sss_global_settings (
      id text PRIMARY KEY,
      site_title text DEFAULT 'StarSuperScare Marketplace',
      site_description text,
      favicon_url text,
      updated_at text NOT NULL
    );
  `);
  
  const existing = await db.execute(sql`SELECT * FROM sss_global_settings LIMIT 1`);
  if (existing.rowCount === 0) {
    await db.execute(sql`
      INSERT INTO sss_global_settings (id, site_title, updated_at)
      VALUES ('global_1', 'StarSuperScare Marketplace', (now() at time zone 'utc')::text)
    `);
  }
  
  console.log('Setup global settings successful');
  Deno.exit(0);
}

run();
