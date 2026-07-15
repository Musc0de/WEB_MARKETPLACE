// deno-lint-ignore-file
import {
  bigint,
  boolean,
  check,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const _stores = pgTable('sss_stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export type StoresTable = typeof _stores;
export const stores: StoresTable = _stores;

const _categories = pgTable('sss_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentId: uuid('parent_id'),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  version: integer('version').default(1).notNull(),
});
export type CategoriesTable = typeof _categories;
export const categories: CategoriesTable = _categories;

const _brands = pgTable('sss_brands', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  version: integer('version').default(1).notNull(),
});
export type BrandsTable = typeof _brands;
export const brands: BrandsTable = _brands;

const _products = pgTable('sss_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').notNull().references(() => stores.id),
  brandId: uuid('brand_id').references(() => brands.id),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'physical', 'digital', 'service'
  description: text('description'),
  status: text('status').notNull().default('draft'), // draft, active, inactive, archived, discontinued
  purchaseLimit: integer('purchase_limit').notNull().default(0), // 0 means unlimited
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  publishedAt: timestamp('published_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  version: integer('version').default(1).notNull(),
});
export type ProductsTable = typeof _products;
export const products: ProductsTable = _products;

const _productVariants = pgTable('sss_product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull().unique(),
  optionValues: jsonb('option_values'),
  price: bigint('price', { mode: 'number' }).notNull(),
  comparePrice: bigint('compare_price', { mode: 'number' }),
  weight: integer('weight'), // in grams
  dimension: jsonb('dimension'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  version: integer('version').default(1).notNull(),
}, (table) => ({
  priceCheck: check('price_check', sql`${table.price} >= 0`),
  comparePriceCheck: check('compare_price_check', sql`${table.comparePrice} >= 0`),
}));
export type ProductVariantsTable = typeof _productVariants;
export const productVariants: ProductVariantsTable = _productVariants;

const _variantPrices = pgTable('sss_variant_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, {
    onDelete: 'cascade',
  }),
  price: bigint('price', { mode: 'number' }).notNull(),
  compareAtPrice: bigint('compare_at_price', { mode: 'number' }),
  effectiveFrom: timestamp('effective_from', { withTimezone: true, mode: 'string' }).defaultNow()
    .notNull(),
  effectiveTo: timestamp('effective_to', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
  priceCheck: check('variant_price_check', sql`${table.price} >= 0`),
  compareAtPriceCheck: check('variant_compare_price_check', sql`${table.compareAtPrice} >= 0`),
}));
export type VariantPricesTable = typeof _variantPrices;
export const variantPrices: VariantPricesTable = _variantPrices;

const _productImages = pgTable('sss_product_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  objectKey: text('object_key').notNull(),
  isPrimary: boolean('is_primary').default(false),
  sortOrder: integer('sort_order').default(0),
  metadata: jsonb('metadata'), // e.g., alt text, dimensions, etc
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export type ProductImagesTable = typeof _productImages;
export const productImages: ProductImagesTable = _productImages;

const _productCategories = pgTable('sss_product_categories', {
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, {
    onDelete: 'cascade',
  }),
});
export type ProductCategoriesTable = typeof _productCategories;
export const productCategories: ProductCategoriesTable = _productCategories;

const _productSalesStats = pgTable('sss_product_sales_stats', {
  productId: uuid('product_id').primaryKey().references(() => products.id, { onDelete: 'cascade' }),
  grossSold: integer('gross_sold').notNull().default(0),
  refunded: integer('refunded').notNull().default(0),
  netSold: integer('net_sold').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
export type ProductSalesStatsTable = typeof _productSalesStats;
export const productSalesStats: ProductSalesStatsTable = _productSalesStats;
