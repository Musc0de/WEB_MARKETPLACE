import { bigint, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { users } from './identity.ts';
import { productVariants } from './catalog.ts';

export const carts = pgTable('sss_carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  guestTokenHash: text('guest_token_hash'),
  status: text('status').notNull().default('active'), // 'active', 'converted', 'abandoned'
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
  userActiveCartIdx: uniqueIndex('user_active_cart_idx')
    .on(table.userId)
    .where(sql`${table.status} = 'active'`),
}));

export const cartItems = pgTable('sss_cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  quantity: integer('quantity').notNull().default(1),
  selected: integer('selected').notNull().default(1), // 1 for true, 0 for false
  saveForLater: integer('save_for_later').notNull().default(0), // 1 for true, 0 for false
  priceObservation: bigint('price_observation', { mode: 'number' }), // price at the time of adding
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
