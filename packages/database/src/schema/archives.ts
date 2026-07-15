// deno-lint-ignore-file explicit-module-boundary-types
import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const orderArchives = pgTable('sss_order_archives', {
  id: uuid('id').primaryKey(), // Original order ID
  orderNumber: text('order_number').notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true, mode: 'string' }).defaultNow()
    .notNull(),
  originalCreatedAt: timestamp('original_created_at', { withTimezone: true, mode: 'string' })
    .notNull(),
  dataSnapshot: jsonb('data_snapshot').notNull(),
});

export { orderArchives };

const outboxArchives = pgTable('sss_outbox_archives', {
  id: uuid('id').primaryKey(), // Original event ID
  type: text('type').notNull(),
  payload: jsonb('payload').notNull(),
  state: text('state').notNull(),
  errorDetails: text('error_details'),
  retryCount: integer('retry_count').notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true, mode: 'string' }).defaultNow()
    .notNull(),
  originalCreatedAt: timestamp('original_created_at', { withTimezone: true, mode: 'string' })
    .notNull(),
});

export { outboxArchives };
