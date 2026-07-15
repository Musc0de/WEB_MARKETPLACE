import { z } from 'zod';
import { ProductListItem, ProductListItemSchema } from './catalog.ts';

// Types
export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product?: ProductListItem | null | undefined;
}

export interface AddWishlistRequest {
  productId: string;
}

export interface RemoveWishlistRequest {
  productId: string;
}

export interface MergeWishlistRequest {
  productIds: string[];
}

export interface WishlistListResponse {
  data: WishlistItem[];
  meta: {
    request_id: string;
  };
  error: null;
}

// Zod Schemas
export const WishlistItemSchema: z.ZodType<WishlistItem> = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  createdAt: z.string().datetime(),
  product: ProductListItemSchema.nullable().optional(),
});

export const AddWishlistRequestSchema: z.ZodType<AddWishlistRequest> = z.object({
  productId: z.string().uuid(),
});

export const RemoveWishlistRequestSchema: z.ZodType<RemoveWishlistRequest> = z.object({
  productId: z.string().uuid(),
});

export const MergeWishlistRequestSchema: z.ZodType<MergeWishlistRequest> = z.object({
  productIds: z.array(z.string().uuid()),
});

export const WishlistListResponseSchema: z.ZodType<WishlistListResponse> = z.object({
  data: z.array(WishlistItemSchema),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.null(),
});
