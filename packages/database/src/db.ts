// deno-lint-ignore-file
import { Pool } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema/index.ts';

const connectionString =
  (typeof Deno !== 'undefined'
    ? Deno.env.get('DATABASE_URL')
    : process?.env?.DATABASE_URL) as string;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
export const db: NeonDatabase<typeof schema> = drizzle(pool, { schema });
