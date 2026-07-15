import { z } from 'zod';
import {
  ProductListItem,
  ProductListItemSchema,
  ProductVariant,
  ProductVariantSchema,
} from './catalog.ts';

// Types
export type CartItemStatus =
  | 'available'
  | 'out_of_stock'
  | 'price_changed'
  | 'inactive'
  | 'quantity_adjusted';

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  selected: boolean;
  saveForLater: boolean;
  priceObservation?: number | null | undefined;
  note?: string | null | undefined;
  createdAt: string;
  // Computed fields
  status: CartItemStatus;
  lineTotal: number;
  // Product info
  product?: ProductListItem | null | undefined;
  variant?: ProductVariant | null | undefined;
}

export interface CartSummary {
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
}

export interface CartResponse {
  data: {
    guestToken?: string | undefined; // Only returned when newly generated
    items: CartItem[];
    summary: CartSummary;
  };
  meta: {
    request_id: string;
  };
  error: null | string;
}

export interface AddCartItemRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity?: number | undefined;
  selected?: boolean | undefined;
  saveForLater?: boolean | undefined;
  note?: string | null | undefined;
}

export interface MergeCartRequest {
  guestToken: string;
}

// Zod Schemas
export const CartItemStatusSchema = z.enum([
  'available',
  'out_of_stock',
  'price_changed',
  'inactive',
  'quantity_adjusted',
]);

export const CartItemSchema: z.ZodType<CartItem> = z.object({
  id: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  selected: z.boolean(),
  saveForLater: z.boolean(),
  priceObservation: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  status: CartItemStatusSchema,
  lineTotal: z.number().int(),
  product: ProductListItemSchema.nullable().optional(),
  variant: ProductVariantSchema.nullable().optional(),
});

export const CartSummarySchema: z.ZodType<CartSummary> = z.object({
  subtotal: z.number().int(),
  totalDiscount: z.number().int(),
  grandTotal: z.number().int(),
});

export const CartResponseSchema: z.ZodType<CartResponse> = z.object({
  data: z.object({
    guestToken: z.string().optional(),
    items: z.array(CartItemSchema),
    summary: CartSummarySchema,
  }),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.string().nullable(),
});

export const AddCartItemRequestSchema: z.ZodType<AddCartItemRequest> = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const UpdateCartItemRequestSchema: z.ZodType<UpdateCartItemRequest> = z.object({
  quantity: z.number().int().min(1).optional(),
  selected: z.boolean().optional(),
  saveForLater: z.boolean().optional(),
  note: z.string().nullable().optional(),
});

export const MergeCartRequestSchema: z.ZodType<MergeCartRequest> = z.object({
  guestToken: z.string(),
});
