import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';
import { products } from './catalog.ts';
import { orderItems } from './orders.ts';

export const reviews = pgTable('sss_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  orderItemId: uuid('order_item_id').notNull().references(() => orderItems.id),
  rating: integer('rating').notNull(), // 1 to 5
  isVerifiedPurchase: integer('is_verified_purchase').notNull().default(1), // 1 for true, 0 for false
  title: text('title'),
  content: text('content'),
  moderationStatus: text('moderation_status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
  sellerResponse: text('seller_response'),
  publishedAt: timestamp('published_at', { withTimezone: true, mode: 'string' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const productRatingStats = pgTable('sss_product_rating_stats', {
  productId: uuid('product_id').primaryKey().references(() => products.id, { onDelete: 'cascade' }),
  averageRating: integer('average_rating').notNull().default(0), // multiplied by 100 for precision, e.g., 450 = 4.5
  reviewCount: integer('review_count').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
