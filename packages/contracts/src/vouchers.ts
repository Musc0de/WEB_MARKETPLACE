import { z } from 'zod';

export interface VoucherValidationRequest {
  code: string;
}

export interface VoucherValidationResponse {
  data: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountAmount: number;
  };
  meta: {
    request_id: string;
  };
  error: null | string;
}

export const VoucherValidationRequestSchema: z.ZodType<VoucherValidationRequest> = z.object({
  code: z.string().min(1),
});

export const VoucherValidationResponseSchema: z.ZodType<VoucherValidationResponse> = z.object({
  data: z.object({
    code: z.string(),
    discountType: z.enum(['percentage', 'fixed']),
    discountAmount: z.number().int(),
  }),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.string().nullable(),
});
