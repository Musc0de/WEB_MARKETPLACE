import { expect } from 'jsr:@std/expect@1';
import { db } from '@starsuperscare/database';
import { outboxEvents } from '@starsuperscare/database';
import { processOutboxEvent } from '../src/outbox/processor.ts';
import { defaultRegistry } from '../src/outbox/registry.ts';
import { eq } from 'drizzle-orm';
const uuidv4 = () => crypto.randomUUID();

Deno.test({
  name: 'Outbox Event Processor - Success',
  async fn() {
    let handlerCalled = false;
    defaultRegistry.register('test.success', (payload: any) => {
      handlerCalled = true;
      expect(payload.test).toBe(true);
      return Promise.resolve();
    });

    const id = uuidv4();
    await db.insert(outboxEvents).values({
      id,
      type: 'test.success',
      payload: { test: true },
      state: 'pending',
    });

    const [event] = await db.select().from(outboxEvents).where(eq(outboxEvents.id, id));
    await processOutboxEvent(event);

    const [updatedEvent] = await db.select().from(outboxEvents).where(eq(outboxEvents.id, id));
    expect(handlerCalled).toBe(true);
    expect(updatedEvent.state).toBe('completed');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'Outbox Event Processor - Retry and Dead Letter',
  async fn() {
    defaultRegistry.register('test.fail', () => {
      return Promise.reject(new Error('Intentional failure'));
    });

    const id = uuidv4();
    await db.insert(outboxEvents).values({
      id,
      type: 'test.fail',
      payload: {},
      state: 'pending',
    });

    // First attempt
    let [event] = await db.select().from(outboxEvents).where(eq(outboxEvents.id, id));
    await processOutboxEvent(event);

    let [updatedEvent] = await db.select().from(outboxEvents).where(eq(outboxEvents.id, id));
    expect(updatedEvent.state).toBe('pending');
    expect(updatedEvent.retryCount).toBe(1);
    expect(updatedEvent.errorDetails).toContain('Intentional failure');

    // Simulate 4 more failures to reach MAX_RETRIES (5)
    for (let i = 0; i < 4; i++) {
      event = updatedEvent;
      await processOutboxEvent(event);
      [updatedEvent] = await db.select().from(outboxEvents).where(eq(outboxEvents.id, id));
    }

    // Now it should be a dead letter (failed)
    expect(updatedEvent.state).toBe('failed');
    expect(updatedEvent.retryCount).toBe(5);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
