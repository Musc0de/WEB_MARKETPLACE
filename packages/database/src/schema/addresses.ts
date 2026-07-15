import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';

export const addresses = pgTable('sss_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull().default('shipping'), // 'shipping', 'billing', 'both'
  label: text('label'), // e.g. "Home", "Office"
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),

  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  district: text('district'), // Kecamatan/Kelurahan
  city: text('city').notNull(), // Kota/Kabupaten
  province: text('province').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull().default('ID'),

  isPrimaryShipping: boolean('is_primary_shipping').default(false),
  isPrimaryBilling: boolean('is_primary_billing').default(false),

  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
