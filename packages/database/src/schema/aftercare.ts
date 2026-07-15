// deno-lint-ignore-file explicit-module-boundary-types
import { bigint, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';
import { orderItems, orders } from './orders.ts';
import { boolean } from 'drizzle-orm/pg-core';

export const faqs = pgTable('sss_faqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull().default('general'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const supportTickets = pgTable('sss_support_tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  subject: text('subject').notNull(),
  category: text('category').notNull().default('general'),
  orderId: uuid('order_id').references(() => orders.id),
  status: text('status').notNull().default('open'), // 'open', 'in_progress', 'resolved', 'closed'
  priority: text('priority').notNull().default('normal'), // 'low', 'normal', 'high', 'urgent'
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const supportMessages = pgTable('sss_support_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').notNull().references(() => supportTickets.id, {
    onDelete: 'cascade',
  }),
  senderId: uuid('sender_id').references(() => users.id), // null if system message
  content: text('content').notNull(),
  isInternal: text('is_internal').notNull().default('false'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const returns = pgTable('sss_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected', 'received', 'completed'
  resolution: text('resolution').notNull(), // 'refund', 'exchange', 'store_credit'
  trackingNumber: text('tracking_number'), // return shipping
  reason: text('reason'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const returnItems = pgTable('sss_return_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  returnId: uuid('return_id').notNull().references(() => returns.id, { onDelete: 'cascade' }),
  orderItemId: uuid('order_item_id').notNull().references(() => orderItems.id),
  quantity: integer('quantity').notNull(),
  reasonDetail: text('reason_detail'),
  condition: text('condition'), // 'unopened', 'opened', 'damaged'
});

export const refunds = pgTable('sss_refunds', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  returnId: uuid('return_id').references(() => returns.id), // Optional, could be a refund without a physical return
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  providerReference: text('provider_reference'), // to map to payment gateway
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const attachments = pgTable('sss_attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceType: text('reference_type').notNull(), // 'ticket', 'message', 'return', 'review'
  referenceId: uuid('reference_id').notNull(), // generic reference
  objectKey: text('object_key').notNull(), // S3 or similar key
  fileName: text('file_name'),
  mimeType: text('mime_type'),
  sizeBytes: integer('size_bytes'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
