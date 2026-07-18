// deno-lint-ignore-file
import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const globalSettings = pgTable('sss_global_settings', {
  id: text('id').primaryKey(),
  siteTitle: text('site_title').default('StarSuperScare Marketplace'),
  siteDescription: text('site_description'),
  faviconUrl: text('favicon_url'),
  activePaymentGateway: text('active_payment_gateway').default('sandbox').notNull(),
  paymentGatewayConfigs: jsonb('payment_gateway_configs').$type<
    Record<string, { mode: 'sandbox' | 'production'; config?: any }>
  >().default({}),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export const campaignBanners = pgTable('sss_campaign_banners', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  theme: text('theme', { enum: ['light', 'dark', 'primary'] }).default('primary').notNull(),
  badge: text('badge'),
  primaryCtaLabel: text('primary_cta_label'),
  primaryCtaHref: text('primary_cta_href'),
  primaryCtaColor: text('primary_cta_color'),
  secondaryCtaLabel: text('secondary_cta_label'),
  secondaryCtaHref: text('secondary_cta_href'),
  secondaryCtaColor: text('secondary_cta_color'),
  desktopImageUrl: text('desktop_image_url'),
  mobileImageUrl: text('mobile_image_url'),
  isActive: boolean('is_active').default(true).notNull(),
  priority: integer('priority').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});
