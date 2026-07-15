// deno-lint-ignore-file explicit-module-boundary-types
import { bigint, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';
import { orders } from './orders.ts';

// @ts-ignore: Deno isolatedDeclarations workaround
const payments = pgTable('sss_payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  provider: text('provider').notNull(),
  providerTransactionId: text('provider_transaction_id').unique(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: text('status').notNull(), // 'pending', 'success', 'failed'
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { payments };

// @ts-ignore: Deno isolatedDeclarations workaround
const paymentEvents = pgTable('sss_payment_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentId: uuid('payment_id').notNull().references(() => payments.id, { onDelete: 'cascade' }),
  providerEventId: text('provider_event_id').notNull().unique(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { paymentEvents };

// @ts-ignore: Deno isolatedDeclarations workaround
const customerPaymentMethods = pgTable('sss_customer_payment_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerToken: text('provider_token').notNull(),
  displayMetadata: jsonb('display_metadata'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { customerPaymentMethods };

// @ts-ignore: Deno isolatedDeclarations workaround
const invoices = pgTable('sss_invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  pdfObjectKey: text('pdf_object_key'),
  snapshotData: jsonb('snapshot_data'),
  issuedAt: timestamp('issued_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  dueDate: timestamp('due_date', { withTimezone: true, mode: 'string' }),
  status: text('status').notNull().default('unpaid'), // 'unpaid', 'paid', 'void'
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { invoices };

// @ts-ignore: Deno isolatedDeclarations workaround
const shipments = pgTable('sss_shipments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  carrier: text('carrier').notNull(),
  trackingNumber: text('tracking_number'),
  status: text('status').notNull().default('pending'), // pending, shipped, delivered, returned
  shippedAt: timestamp('shipped_at', { withTimezone: true, mode: 'string' }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { shipments };

// @ts-ignore: Deno isolatedDeclarations workaround
const shipmentEvents = pgTable('sss_shipment_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  shipmentId: uuid('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  externalEventId: text('external_event_id').unique(),
  status: text('status').notNull(),
  location: text('location'),
  description: text('description'),
  eventTime: timestamp('event_time', { withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { shipmentEvents };

// @ts-ignore: Deno isolatedDeclarations workaround
const vouchers = pgTable('sss_vouchers', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(), // 'percentage', 'fixed'
  discountAmount: bigint('discount_amount', { mode: 'number' }).notNull(),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').notNull().default(0),
  validFrom: timestamp('valid_from', { withTimezone: true, mode: 'string' }),
  validTo: timestamp('valid_to', { withTimezone: true, mode: 'string' }),
  isActive: integer('is_active').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { vouchers };

// @ts-ignore: Deno isolatedDeclarations workaround
const voucherRedemptions = pgTable('sss_voucher_redemptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  voucherId: uuid('voucher_id').notNull().references(() => vouchers.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  discountApplied: bigint('discount_applied', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export { voucherRedemptions };
