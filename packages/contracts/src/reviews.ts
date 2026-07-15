// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';

export interface ReviewItem {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  isVerifiedPurchase: number;
  title: string | null;
  content: string | null;
  moderationStatus: string;
  sellerResponse: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const reviewItemSchema: z.ZodType<ReviewItem> = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  isVerifiedPurchase: z.number(),
  title: z.string().nullable(),
  content: z.string().nullable(),
  moderationStatus: z.string(),
  sellerResponse: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export interface EligibleReviewItem {
  orderItemId: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  variantId: string;
  productName: string;
  variantSku: string;
  primaryImage: string | null;
  purchasedAt: string;
}

export const eligibleReviewItemSchema: z.ZodType<EligibleReviewItem> = z.object({
  orderItemId: z.string().uuid(),
  orderId: z.string().uuid(),
  orderNumber: z.string(),
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  productName: z.string(),
  variantSku: z.string(),
  primaryImage: z.string().nullable(),
  purchasedAt: z.string(),
});

export interface CreateReviewRequest {
  productId: string;
  orderItemId: string;
  rating: number;
  title?: string | null | undefined;
  content?: string | null | undefined;
}

export const createReviewRequestSchema: z.ZodType<CreateReviewRequest> = z.object({
  productId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});

export interface UpdateReviewRequest {
  rating?: number | undefined;
  title?: string | null | undefined;
  content?: string | null | undefined;
}

export const updateReviewRequestSchema: z.ZodType<UpdateReviewRequest> = z.object({
  rating: z.number().min(1).max(5).optional(),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});
