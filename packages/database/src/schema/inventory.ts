import { check, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { productVariants, stores } from './catalog.ts';
import { users } from './identity.ts';

export const warehouses = pgTable('sss_warehouses', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').notNull().references(() => stores.id),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const inventoryLevels = pgTable('sss_inventory_levels', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, {
    onDelete: 'cascade',
  }),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id, {
    onDelete: 'cascade',
  }),
  available: integer('available').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),
  damaged: integer('damaged').notNull().default(0),
  version: integer('version').notNull().default(1), // optimistic concurrency lock
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
  availableCheck: check('available_check', sql`${table.available} >= 0`),
  reservedCheck: check('reserved_check', sql`${table.reserved} >= 0`),
  damagedCheck: check('damaged_check', sql`${table.damaged} >= 0`),
}));

export const inventoryReservations = pgTable('sss_inventory_reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').references(() => users.id), // optional
  quantity: integer('quantity').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  status: text('status').notNull().default('active'), // active, fulfilled, expired, cancelled
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const inventoryMovements = pgTable('sss_inventory_movements', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  warehouseId: uuid('warehouse_id').notNull().references(() => warehouses.id),
  quantity: integer('quantity').notNull(),
  type: text('type').notNull(), // 'receive', 'ship', 'adjust', 'reserve', 'release'
  referenceId: uuid('reference_id'), // Order ID, Return ID, etc
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
