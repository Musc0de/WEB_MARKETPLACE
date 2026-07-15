/**
 * Operational scripts for the worker
 * Run via: deno run -A apps/worker/src/ops.ts [command]
 */

import { db } from '@starsuperscare/database';
import { outboxEvents } from '@starsuperscare/database';
import { eq, sql } from 'drizzle-orm';

const command = Deno.args[0];

async function main() {
  switch (command) {
    case 'inspect':
      await inspectFailedJobs();
      break;
    case 'retry-all':
      await retryAllFailed();
      break;
    case 'retry': {
      const id = Deno.args[1];
      if (!id) {
        console.error('Please provide an event ID to retry.');
        Deno.exit(1);
      }
      await retryJob(id);
      break;
    }
    default:
      console.log(`
Usage:
  deno run -A apps/worker/src/ops.ts inspect
    - Lists all failed jobs in the outbox
  deno run -A apps/worker/src/ops.ts retry-all
    - Marks all failed jobs as pending to be retried
  deno run -A apps/worker/src/ops.ts retry <id>
    - Retries a specific job by ID
      `);
  }
}

async function inspectFailedJobs() {
  const failed = await db.select()
    .from(outboxEvents)
    .where(eq(outboxEvents.state, 'failed'));

  console.log(`Found ${failed.length} failed jobs.`);

  for (const job of failed) {
    console.log(`\nID: ${job.id}`);
    console.log(`Type: ${job.type}`);
    console.log(`Error: ${job.errorDetails}`);
    console.log(`Retries: ${job.retryCount}`);
    console.log(`Payload:`, job.payload);
  }
}

async function retryAllFailed() {
  const result = await db.update(outboxEvents)
    .set({
      state: 'pending',
      availableAt: new Date().toISOString(),
      retryCount: 0,
      errorDetails: sql`NULL`,
    })
    .where(eq(outboxEvents.state, 'failed'))
    .returning({ id: outboxEvents.id });

  console.log(`Queued ${result.length} failed jobs for retry.`);
}

async function retryJob(id: string) {
  const result = await db.update(outboxEvents)
    .set({
      state: 'pending',
      availableAt: new Date().toISOString(),
      retryCount: 0,
      errorDetails: sql`NULL`,
    })
    .where(eq(outboxEvents.id, id))
    .returning({ id: outboxEvents.id });

  if (result.length > 0) {
    console.log(`Job ${id} queued for retry.`);
  } else {
    console.log(`Job ${id} not found.`);
  }
}

if (import.meta.main) {
  main().then(() => Deno.exit(0)).catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}
