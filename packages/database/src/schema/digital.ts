import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { productVariants } from './catalog.ts';
import { users } from './identity.ts';
import { orderItems } from './orders.ts';

export const digitalAssets = pgTable('sss_digital_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, {
    onDelete: 'cascade',
  }),
  objectKey: text('object_key').notNull(),
  version: text('version'),
  checksum: text('checksum'),
  downloadLimit: integer('download_limit'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const digitalEntitlements = pgTable('sss_digital_entitlements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  assetId: uuid('asset_id').notNull().references(() => digitalAssets.id, { onDelete: 'cascade' }),
  orderItemId: uuid('order_item_id').notNull().references(() => orderItems.id, {
    onDelete: 'cascade',
  }),
  downloadCount: integer('download_count').notNull().default(0),
  downloadLimit: integer('download_limit'), // overrides or inherits from asset
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }),
  status: text('status').notNull().default('active'), // 'active', 'revoked', 'expired'
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
