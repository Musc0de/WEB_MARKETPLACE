// deno-lint-ignore-file
import { Pool } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema/index.ts';

const getEnv = (key: string) =>
  typeof Deno !== 'undefined'
    ? (typeof Deno !== 'undefined' ? Deno.env.get(key) : process?.env?.[key])
    : process?.env?.[key];

const connectionString1 = getEnv('DATABASE_URL');
const connectionString2 = getEnv('DATABASE_URL_2');
const connectionString3 = getEnv('DATABASE_URL_3');

if (!connectionString1) {
  throw new Error('DATABASE_URL is not set');
}

// Prepare replicas (filter out empty strings)
const replicas = [connectionString1, connectionString2, connectionString3].filter(
  Boolean,
) as string[];

/**
 * FailoverPool Proxy Wrapper
 * Intercepts query() and connect() methods to gracefully fallback to next replica
 * if the current one throws an error (e.g. timeout, connection refused).
 */
class FailoverPool {
  private pools: Pool[];
  private currentIdx = 0;

  constructor(urls: string[]) {
    this.pools = urls.map(
      (url) =>
        new Pool({
          connectionString: url,
          max: 300,
          connectionTimeoutMillis: 5000, // Faster timeout to shift to replica quickly
          idleTimeoutMillis: 30000,
        }),
    );
  }

  // Intercept query calls
  async query(...args: any[]) {
    let lastError: any;
    for (let i = 0; i < this.pools.length; i++) {
      const idx = (this.currentIdx + i) % this.pools.length;
      try {
        // @ts-ignore
        return await this.pools[idx].query(...args);
      } catch (e: any) {
        lastError = e;
        console.warn(`[DB-FAILOVER] Replica ${idx + 1} failed:`, e.message);
        // Shift primary to next replica for subsequent queries
        this.currentIdx = (this.currentIdx + 1) % this.pools.length;
      }
    }
    throw lastError;
  }

  // Intercept connect calls (for db.transaction)
  async connect(...args: any[]) {
    let lastError: any;
    for (let i = 0; i < this.pools.length; i++) {
      const idx = (this.currentIdx + i) % this.pools.length;
      try {
        // @ts-ignore
        return await this.pools[idx].connect(...args);
      } catch (e: any) {
        lastError = e;
        console.warn(`[DB-FAILOVER] Replica ${idx + 1} failed:`, e.message);
        this.currentIdx = (this.currentIdx + 1) % this.pools.length;
      }
    }
    throw lastError;
  }

  // Delegate event listeners
  on(event: string, listener: any) {
    this.pools.forEach((p) => p.on(event as any, listener));
  }

  async end() {
    await Promise.all(this.pools.map((p) => p.end()));
  }
}

// Cache the pool in globalThis to avoid creating new connections on every hot-reload in development
const globalForDb = globalThis as unknown as { pool: FailoverPool | undefined };

const pool = globalForDb.pool ?? new FailoverPool(replicas);

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
} else if (typeof Deno !== 'undefined') {
  // Rough approximation for Deno development
  const isDev = Deno.env.get('NODE_ENV') !== 'production';
  if (isDev) globalForDb.pool = pool;
}

export const db: NeonDatabase<typeof schema> = drizzle(pool as unknown as Pool, { schema });
