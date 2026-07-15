import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';

export const securityAuditLogs = pgTable('sss_security_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  event: text('event').notNull(), // 'login_success', 'login_failed', etc
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const systemAuditLogs = pgTable('sss_system_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  entityType: text('entity_type').notNull(), // 'order', 'product', 'user'
  entityId: uuid('entity_id').notNull(),
  action: text('action').notNull(), // 'create', 'update', 'delete'
  actorId: uuid('actor_id').references(() => users.id), // null if system
  changes: jsonb('changes'), // e.g., { before: {}, after: {} }
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const idempotencyKeys = pgTable('sss_idempotency_keys', {
  key: text('key').primaryKey(),
  userId: uuid('user_id').references(() => users.id), // Optional, scope to user
  action: text('action').notNull(), // e.g., 'checkout', 'refund'
  response: jsonb('response'), // Store response to replay on duplicate request
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
