import { db } from './db.ts';

/**
 * Helper to wrap database operations in a transaction.
 * @param callback The callback that receives the transaction instance.
 */
export async function withTransaction<T>(
  callback: (tx: typeof db) => Promise<T>,
): Promise<T> {
  // neon-http doesn't fully support interactive transactions the same way Postgres.js does natively,
  // but we provide the abstraction boundary here so it can be swapped if needed.
  // For basic HTTP driver, Drizzle provides a limited transaction API or we use batching.
  // We'll mimic the boundary using drizzle's transaction if available, otherwise just pass the db instance.
  // NOTE: '@neondatabase/serverless' HTTP doesn't do stateful transactions well across requests.
  // The correct pattern for Neon over HTTP is usually batching or relying on individual queries if transactions aren't supported.

  // @ts-ignore: transaction may not be fully supported by HTTP driver depending on version
  if (typeof db.transaction === 'function') {
    try {
      return await db.transaction(async (tx) => {
        // @ts-ignore: tx type is internal to drizzle
        return await callback(tx);
      });
    } catch (e: any) {
      if (e.message && e.message.includes('No transactions support')) {
        // Fallback below
      } else {
        throw e;
      }
    }
  }

  // Fallback if transaction is not supported by current neon HTTP driver
  if (
    (typeof Deno !== 'undefined' ? Deno.env.get('NODE_ENV') : process?.env?.['NODE_ENV']) !== 'test'
  ) {
    console.warn(
      '⚠️ Warning: Transactions might not be strictly ACID with Neon HTTP driver without WebSocket pool.',
    );
  }
  return await callback(db);
}
