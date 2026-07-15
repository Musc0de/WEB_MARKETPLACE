import { db } from '@starsuperscare/database';
import { outboxEvents } from '@starsuperscare/database';
import { and, asc, eq, inArray, lte } from 'drizzle-orm';
import { processOutboxEvent } from './processor.ts';

const BATCH_SIZE = 10;

/**
 * Polls the outbox table for pending events that are ready to be processed.
 * Uses SELECT ... FOR UPDATE SKIP LOCKED to allow concurrent workers.
 * @returns number of events processed in this batch
 */
export async function pollOutbox(): Promise<number> {
  const now = new Date().toISOString();

  let processedCount = 0;

  // 1. Claim a batch of events using SKIP LOCKED inside a short transaction
  const claimedEvents = await db.transaction(async (tx) => {
    const events = await tx.select()
      .from(outboxEvents)
      .where(
        and(
          eq(outboxEvents.state, 'pending'),
          lte(outboxEvents.availableAt, now),
        ),
      )
      .orderBy(asc(outboxEvents.createdAt))
      .limit(BATCH_SIZE)
      .for('update', { skipLocked: true });

    if (events.length > 0) {
      const eventIds = events.map((e) => e.id);

      // 2. Mark them as 'processing' so they aren't picked up by another transaction
      // and we can release the row locks when this transaction ends, allowing us to
      // process them outside of the lock safely. We also update availableAt to track when processing started.
      await tx.update(outboxEvents)
        .set({ state: 'processing', availableAt: now })
        .where(inArray(outboxEvents.id, eventIds));
    }

    return events;
  });

  if (!claimedEvents || claimedEvents.length === 0) {
    return 0;
  }

  // 3. Process each event (sequentially or in parallel, depending on desired concurrency)
  // We'll do it sequentially to avoid overwhelming resources if handlers are heavy
  for (const event of claimedEvents) {
    await processOutboxEvent(event);
    processedCount++;
  }

  return processedCount;
}
