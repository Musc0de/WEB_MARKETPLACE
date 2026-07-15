import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as path from 'node:path';
config({ path: path.resolve(Deno.cwd(), '../../.env') });

async function resetDb() {
  const url = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;
  if (!url) throw new Error('No URL');
  const sql = neon(url);
  console.log('Dropping public schema...');
  await sql`DROP SCHEMA public CASCADE;`;
  console.log('Creating public schema...');
  await sql`CREATE SCHEMA public;`;
  console.log('DB reset.');
}

resetDb().catch(console.error);
