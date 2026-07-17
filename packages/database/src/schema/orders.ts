import { bigint, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './identity.ts';
import { products, productVariants } from './catalog.ts';

// @ts-ignore: Deno isolatedDeclarations workaround
export const orders = pgTable('sss_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  idempotencyKey: text('idempotency_key').unique(),
  userId: uuid('user_id').references(() => users.id),
  emailSnapshot: text('email_snapshot').notNull(),
  totalAmount: bigint('total_amount', { mode: 'number' }).notNull(),
  subtotalAmount: bigint('subtotal_amount', { mode: 'number' }).notNull(),
  discountAmount: bigint('discount_amount', { mode: 'number' }).notNull().default(0),
  shippingAmount: bigint('shipping_amount', { mode: 'number' }).notNull().default(0),
  taxAmount: bigint('tax_amount', { mode: 'number' }).notNull().default(0),
  serviceFeeAmount: bigint('service_fee_amount', { mode: 'number' }).notNull().default(0),
  status: text('status').notNull().default('pending'), // 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// @ts-ignore: Deno isolatedDeclarations workaround
export const orderItems = pgTable('sss_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  priceSnapshot: bigint('price_snapshot', { mode: 'number' }).notNull(),
  productNameSnapshot: text('product_name_snapshot').notNull(),
  variantSkuSnapshot: text('variant_sku_snapshot').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// @ts-ignore: Deno isolatedDeclarations workaround
export const orderAddresses = pgTable('sss_order_addresses', {
  orderId: uuid('order_id').primaryKey().references(() => orders.id, { onDelete: 'cascade' }),
  shippingSnapshot: jsonb('shipping_snapshot').notNull(),
  billingSnapshot: jsonb('billing_snapshot'),
});

// @ts-ignore: Deno isolatedDeclarations workaround
export const orderStatusHistory = pgTable('sss_order_status_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// @ts-ignore: Deno isolatedDeclarations workaround
export const trackingTokens = pgTable('sss_tracking_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// @ts-ignore: Deno isolatedDeclarations workaround
export const cancellationRequests = pgTable('sss_cancellation_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('requested'), // 'requested', 'under_review', 'approved', 'rejected'
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
