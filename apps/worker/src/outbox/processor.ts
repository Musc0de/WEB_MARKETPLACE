import { db } from '@starsuperscare/database';
import { jobAttempts, outboxEvents } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { defaultRegistry } from './registry.ts';
import { alertOnFailure, recordMetric } from '../observability/metrics.ts';

const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000; // 1 second
const CAP_BACKOFF_MS = 1000 * 60 * 60 * 24; // 1 day

/**
 * Calculates exponential backoff with full jitter.
 * See: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
 */
function calculateBackoffJitter(retryCount: number): number {
  const temp = Math.min(CAP_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** retryCount);
  // Jitter: random value between 0 and temp
  return Math.floor(Math.random() * temp);
}

export async function processOutboxEvent(event: typeof outboxEvents.$inferSelect): Promise<void> {
  const handler = defaultRegistry.getHandler(event.type);

  if (!handler) {
    // If no handler is registered, we can either ignore it or mark it as failed.
    // For now, let's fail it so it doesn't get stuck processing.
    await markAsFailed(event.id, `No handler registered for event type: ${event.type}`);
    return;
  }

  // Record an attempt
  const [attempt] = await db.insert(jobAttempts).values({
    jobId: event.id,
    jobType: 'outbox_event',
    status: 'started',
  }).returning();

  try {
    // Execute handler
    await handler(event.payload, event.id);

    // Mark as completed
    await db.update(outboxEvents).set({
      state: 'completed',
      processedAt: new Date().toISOString(),
    }).where(eq(outboxEvents.id, event.id));

    // Update attempt
    await db.update(jobAttempts).set({
      status: 'completed',
      completedAt: new Date().toISOString(),
    }).where(eq(jobAttempts.id, attempt.id));

    recordMetric('outbox_event_success', 1, { type: event.type });
  } catch (error: any) {
    const errorDetails = error.message || String(error);
    const nextRetryCount = event.retryCount + 1;

    // Update attempt
    await db.update(jobAttempts).set({
      status: 'failed',
      errorDetails,
      completedAt: new Date().toISOString(),
    }).where(eq(jobAttempts.id, attempt.id));

    if (nextRetryCount >= MAX_RETRIES) {
      // Dead letter
      await markAsFailed(event.id, errorDetails, nextRetryCount);
    } else {
      // Schedule next retry with exponential backoff + jitter
      const backoffMs = calculateBackoffJitter(nextRetryCount);
      const nextAvailableAt = new Date(Date.now() + backoffMs);

      await db.update(outboxEvents).set({
        state: 'pending', // Keeps it available for polling later
        retryCount: nextRetryCount,
        errorDetails,
        availableAt: nextAvailableAt.toISOString(),
      }).where(eq(outboxEvents.id, event.id));
      console.log(
        `[Processor] Updated event ${event.id} (${event.type}) to pending with retryCount ${nextRetryCount}`,
      );
    }
  }
}

async function markAsFailed(eventId: string, errorDetails: string, retryCount?: number) {
  const updateData: any = {
    state: 'failed',
    errorDetails,
    processedAt: new Date().toISOString(),
  };

  if (retryCount !== undefined) {
    updateData.retryCount = retryCount;
  }

  await db.update(outboxEvents).set(updateData).where(eq(outboxEvents.id, eventId));
  alertOnFailure(
    'outbox_processor',
    `Dead letter: Event ${eventId} failed permanently. Error: ${errorDetails}`,
    'high',
  );
}
