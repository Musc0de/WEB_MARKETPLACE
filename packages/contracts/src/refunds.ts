// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';
import { PaginationSchema } from './http.ts';

export interface RefundItem {
  id: string;
  orderId: string;
  returnId: string | null;
  amount: number;
  status: string; // 'pending', 'processing', 'completed', 'failed'
  providerReference: string | null;
  proofImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const refundItemSchema: z.ZodType<RefundItem> = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  returnId: z.string().uuid().nullable(),
  amount: z.number(),
  status: z.string(),
  providerReference: z.string().nullable(),
  proofImageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export interface ProcessRefundRequest {
  amount?: number | undefined;
  restockItems?: boolean | undefined;
  proofImageUrl?: string | undefined;
}

export const processRefundRequestSchema: z.ZodType<ProcessRefundRequest> = z.object({
  amount: z.number().min(0).optional(),
  restockItems: z.boolean().optional(),
  proofImageUrl: z.string().optional(),
});

export interface RefundListResponse {
  data: RefundItem[];
  meta?: any;
  error: string | null;
}

export const refundListResponseSchema: z.ZodType<RefundListResponse> = z.object({
  data: z.array(refundItemSchema),
  meta: PaginationSchema.optional(),
  error: z.string().nullable(),
});
