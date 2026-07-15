// deno-lint-ignore-file
import { pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from './identity.ts';
import { products } from './catalog.ts';

const _wishlists = pgTable(
  'sss_wishlists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => ({
    wishlistUserProductIdx: uniqueIndex('wishlist_user_product_idx').on(t.userId, t.productId),
  }),
);

export type WishlistsTable = typeof _wishlists;
export const wishlists: WishlistsTable = _wishlists;
