// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';
import { PaginationSchema } from './http.ts';

export interface ReturnItem {
  id: string;
  orderId: string;
  userId: string;
  status: string; // 'pending', 'approved', 'rejected', 'received', 'completed'
  resolution: string; // 'refund', 'exchange', 'store_credit'
  trackingNumber: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  items?: any[] | undefined;
}

export const returnItemSchema: z.ZodType<ReturnItem> = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.string(),
  resolution: z.string(),
  trackingNumber: z.string().nullable(),
  reason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(z.any()).optional(),
});

export interface CreateReturnRequest {
  orderId: string;
  resolution: string;
  reason?: string | null | undefined;
  items: {
    orderItemId: string;
    quantity: number;
    reasonDetail?: string | null | undefined;
    condition?: string | null | undefined;
  }[];
}

export const createReturnRequestSchema: z.ZodType<CreateReturnRequest> = z.object({
  orderId: z.string().uuid(),
  resolution: z.enum(['refund', 'exchange', 'store_credit']),
  reason: z.string().optional().nullable(),
  items: z.array(z.object({
    orderItemId: z.string().uuid(),
    quantity: z.number().min(1),
    reasonDetail: z.string().optional().nullable(),
    condition: z.string().optional().nullable(),
  })).min(1),
});

export interface UpdateReturnStatusRequest {
  status: string; // 'approved', 'rejected', 'received', 'completed'
  trackingNumber?: string | null | undefined;
}

export const updateReturnStatusRequestSchema: z.ZodType<UpdateReturnStatusRequest> = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'received', 'completed']),
  trackingNumber: z.string().optional().nullable(),
});

export interface ReturnListResponse {
  data: ReturnItem[];
  meta?: any;
  error: string | null;
}

export const returnListResponseSchema: z.ZodType<ReturnListResponse> = z.object({
  data: z.array(returnItemSchema),
  meta: PaginationSchema.optional(),
  error: z.string().nullable(),
});
