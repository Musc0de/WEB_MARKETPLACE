// deno-lint-ignore-file explicit-module-boundary-types
import { bigint, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';
import { cancellationRequests, orderItems, orders } from './orders.ts';
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
  returnNumber: text('return_number'), // Optional, can be generated like RET-123
  orderId: uuid('order_id').notNull().references(() => orders.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: text('status').notNull().default('requested'), // 'requested', 'under_review', 'awaiting_evidence', 'approved', 'rejected', 'awaiting_return_shipment', 'return_shipped', 'return_received', 'inspection', 'refund_processing', 'replacement_processing', 'resolved', 'closed', 'escalated'
  resolution: text('resolution').notNull(), // 'refund_only', 'return_and_refund', 'replacement'
  reasonCode: text('reason_code'),
  description: text('description'),
  requestedAmount: bigint('requested_amount', { mode: 'number' }),
  approvedAmount: bigint('approved_amount', { mode: 'number' }),
  returnDeadline: timestamp('return_deadline', { withTimezone: true, mode: 'string' }),
  trackingNumber: text('tracking_number'), // return shipping
  courierName: text('courier_name'),
  rejectionReason: text('rejection_reason'),
  assignedAdminId: uuid('assigned_admin_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const returnItems = pgTable('sss_return_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  returnId: uuid('return_id').notNull().references(() => returns.id, { onDelete: 'cascade' }),
  orderItemId: uuid('order_item_id').notNull().references(() => orderItems.id),
  quantity: integer('quantity').notNull(),
  paidUnitAmount: bigint('paid_unit_amount', { mode: 'number' }),
  requestedRefundAmount: bigint('requested_refund_amount', { mode: 'number' }),
  approvedRefundAmount: bigint('approved_refund_amount', { mode: 'number' }),
  reasonDetail: text('reason_detail'),
  condition: text('condition'), // 'unopened', 'opened', 'damaged'
  inspectionResult: text('inspection_result'), // 'restockable', 'damaged', 'defective'
  restockDecision: text('restock_decision'), // 'restock', 'discard', 'repair'
  stockRestoredAt: timestamp('stock_restored_at', { withTimezone: true, mode: 'string' }),
});

export const refunds = pgTable('sss_refunds', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  returnId: uuid('return_id').references(() => returns.id), // Optional, could be a refund without a physical return
  cancellationRequestId: uuid('cancellation_request_id').references(() => cancellationRequests.id), // Optional, for cancellations
  paymentId: uuid('payment_id'), // Maps to the original payment record
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed', 'manual_review_required'
  providerReference: text('provider_reference'), // to map to payment gateway
  gatewayRefundId: text('gateway_refund_id'),
  idempotencyKey: text('idempotency_key').unique(),
  failureReason: text('failure_reason'),
  proofImageUrl: text('proof_image_url'),
  requestedAt: timestamp('requested_at', { withTimezone: true, mode: 'string' }),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
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

export const returnEvents = pgTable('sss_return_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  returnId: uuid('return_id').notNull().references(() => returns.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(), // 'return_requested', 'return_approved', 'inspection_started', etc.
  actorType: text('actor_type').notNull(), // 'customer', 'admin', 'system'
  actorId: uuid('actor_id'), // references users.id (admin or customer)
  description: text('description'),
  metadata: text('metadata'), // JSON string for extra info
  isPublic: boolean('is_public').notNull().default(true), // if false, only admin sees it
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
