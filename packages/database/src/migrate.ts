import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';
import * as path from 'node:path';
config({ path: path.resolve(Deno.cwd(), '../../.env') });

async function runMigrate() {
  const connectionString = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL_DIRECT or DATABASE_URL is not set');
  }

  const client = neon(connectionString);
  const db = drizzle(client);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './migrations' });
  console.log('Migrations completed successfully.');
}

if (import.meta.main) {
  runMigrate().catch((err) => {
    console.error('Migration failed:', err);
    Deno.exit(1);
  });
}
