// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';

export const invoiceStatusSchema: z.ZodType<'pending' | 'generated' | 'failed'> = z.enum([
  'pending',
  'generated',
  'failed',
]);

export const invoiceDataSchema: z.ZodType<{
  id: string;
  orderId: string;
  invoiceNumber: string;
  pdfObjectKey: string | null;
  status: 'pending' | 'generated' | 'failed';
  snapshotData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}> = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  invoiceNumber: z.string(),
  pdfObjectKey: z.string().nullable(),
  status: invoiceStatusSchema,
  snapshotData: z.record(z.string(), z.any()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type InvoiceData = z.infer<typeof invoiceDataSchema>;

import { PaginationSchema } from './http.ts';

const _invoiceListResponseSchema = z.object({
  data: z.object({
    invoices: z.array(invoiceDataSchema),
    pagination: PaginationSchema,
  }),
  meta: z.object({ request_id: z.string() }),
  error: z.any().nullable(),
});

export const invoiceListResponseSchema: typeof _invoiceListResponseSchema =
  _invoiceListResponseSchema;
export type InvoiceListResponse = z.infer<typeof _invoiceListResponseSchema>;
