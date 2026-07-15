import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';

const _notifications = pgTable('sss_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  actionUrl: text('action_url'),
  dataJson: jsonb('data_json'),
  dedupeKey: text('dedupe_key').unique(),
  readAt: timestamp('read_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export type NotificationsTable = typeof _notifications;
export const notifications: NotificationsTable = _notifications;

const _outboxEvents = pgTable('sss_outbox_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type').notNull(),
  payload: jsonb('payload').notNull(),
  state: text('state').notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  errorDetails: text('error_details'),
  retryCount: integer('retry_count').notNull().default(0),
  availableAt: timestamp('available_at', { withTimezone: true, mode: 'string' }).defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true, mode: 'string' }),
});

export type OutboxEventsTable = typeof _outboxEvents;
export const outboxEvents: OutboxEventsTable = _outboxEvents;

// @ts-ignore: Deno isolatedDeclarations workaround
export const notificationDeliveries = pgTable('sss_notification_deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  notificationId: uuid('notification_id').notNull().references(() => notifications.id, {
    onDelete: 'cascade',
  }),
  provider: text('provider').notNull(), // 'fcm', 'resend', 'sns', etc
  providerMessageId: text('provider_message_id'),
  status: text('status').notNull().default('pending'), // 'pending', 'sent', 'delivered', 'failed'
  errorDetails: text('error_details'),
  sentAt: timestamp('sent_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// @ts-ignore: Deno isolatedDeclarations workaround
export const jobAttempts = pgTable('sss_job_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull(), // generic reference to a job (could be outbox event ID)
  jobType: text('job_type').notNull(),
  status: text('status').notNull(), // 'started', 'completed', 'failed'
  errorDetails: text('error_details'),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
});
