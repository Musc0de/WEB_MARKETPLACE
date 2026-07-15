// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';

export const EmptySchema: z.ZodObject<any, any> = z.object({});

export * from './src/http.ts';
export * from './src/catalog.ts';
export * from './src/admin-catalog.ts';

export * from './src/assets.ts';
export * from './src/inventory.ts';

// Force export for IDE to refresh cache
export type { ProductDetail, ProductListItem, ProductVariant } from './src/catalog.ts';
export * from './src/wishlist.ts';
export * from './src/cart.ts';
export * from './src/vouchers.ts';
export * from './src/checkout.ts';
export * from './src/payments.ts';
export * from './src/invoice.ts';
export * from './src/history.ts';
export * from './src/returns.ts';
export * from './src/refunds.ts';
export * from './src/downloads.ts';
export * from './src/notifications.ts';
export * from './src/reviews.ts';
export * from './src/support.ts';
export * from './src/admin-orders.ts';
export * from './src/admin-customers.ts';
export * from './src/admin-payments.ts';
export {
  AddWishlistRequestSchema,
  MergeWishlistRequestSchema,
  RemoveWishlistRequestSchema,
  WishlistItemSchema,
  WishlistListResponseSchema,
} from './src/wishlist.ts';
