// deno-lint-ignore-file
import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema/index.ts';

const connectionString =
  (typeof Deno !== 'undefined'
    ? Deno.env.get('DATABASE_URL')
    : process?.env?.DATABASE_URL) as string;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

/**
 * Force Neon Pool to use HTTP fetch for all queries instead of WebSocket.
 *
 * Root cause of the silent INSERT failure:
 *  - The Neon WebSocket Pool opens a persistent WS connection.
 *  - Neon's serverless backend (and Deno's runtime) can forcibly close
 *    (ECONNRESET) idle WebSocket connections between requests.
 *  - When the WS is reset mid-query, the awaited INSERT Promise may resolve
 *    without actually committing — or the error is swallowed by the Pool internals.
 *
 * Setting poolQueryViaFetch = true routes every individual query through
 * a fresh HTTPS request to the Neon HTTP endpoint, which is:
 *  1. Stateless — no persistent connection to drop.
 *  2. Immune to Deno's request.signal legacy abort behaviour.
 *  3. Compatible with drizzle-orm/neon-serverless (same Pool API, different transport).
 */
neonConfig.poolQueryViaFetch = true;

const pool = new Pool({ connectionString, max: 5 });
export const db: NeonDatabase<typeof schema> = drizzle(pool, { schema });
