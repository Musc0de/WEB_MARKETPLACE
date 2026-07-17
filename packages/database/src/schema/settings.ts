// deno-lint-ignore-file
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const globalSettings = pgTable('sss_global_settings', {
  id: text('id').primaryKey(),
  siteTitle: text('site_title').default('StarSuperScare Marketplace'),
  siteDescription: text('site_description'),
  faviconUrl: text('favicon_url'),
  activePaymentGateway: text('active_payment_gateway').default('sandbox').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});
