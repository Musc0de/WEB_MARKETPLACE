// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';
import { PaginationSchema } from './http.ts';

const _downloadEntitlementSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  downloadCount: z.number(),
  downloadLimit: z.number().nullable(),
  expiresAt: z.string().nullable(),
  status: z.enum(['active', 'revoked', 'expired']),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Metadata for UI
  productName: z.string().optional(),
  variantName: z.string().optional(),
  version: z.string().nullable().optional(),
});

export const downloadEntitlementSchema: typeof _downloadEntitlementSchema =
  _downloadEntitlementSchema;
export type DownloadEntitlement = z.infer<typeof _downloadEntitlementSchema>;

const _downloadsResponseSchema = z.object({
  data: z.object({
    entitlements: z.array(_downloadEntitlementSchema),
    pagination: PaginationSchema,
  }),
  meta: z.object({
    request_id: z.string(),
  }),
  error: z.any().nullable(),
});

export const downloadsResponseSchema: typeof _downloadsResponseSchema = _downloadsResponseSchema;
export type DownloadsResponse = z.infer<typeof _downloadsResponseSchema>;
