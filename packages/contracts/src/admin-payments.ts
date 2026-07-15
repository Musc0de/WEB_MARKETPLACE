import { z } from 'zod';

export const adminPaymentListItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  orderNumber: z.string().optional(),
  provider: z.string(),
  providerTransactionId: z.string().nullable(),
  amount: z.number(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminPaymentListItem = z.infer<typeof adminPaymentListItemSchema>;

export const adminPaymentListResponseSchema = z.object({
  data: z.array(adminPaymentListItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type AdminPaymentListResponse = z.infer<typeof adminPaymentListResponseSchema>;

export const adminPaymentEventSchema = z.object({
  id: z.string().uuid(),
  paymentId: z.string().uuid(),
  providerEventId: z.string(),
  eventType: z.string(),
  payload: z.any(),
  createdAt: z.string(),
});
export type AdminPaymentEvent = z.infer<typeof adminPaymentEventSchema>;

export const adminInvoiceListItemSchema = z.object({
  id: z.string().uuid(),
  invoiceNumber: z.string(),
  orderId: z.string().uuid(),
  orderNumber: z.string().optional(),
  pdfObjectKey: z.string().nullable(),
  issuedAt: z.string(),
  dueDate: z.string().nullable(),
  status: z.enum(['unpaid', 'paid', 'void']),
  createdAt: z.string(),
});
export type AdminInvoiceListItem = z.infer<typeof adminInvoiceListItemSchema>;

export const adminInvoiceListResponseSchema = z.object({
  data: z.array(adminInvoiceListItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type AdminInvoiceListResponse = z.infer<typeof adminInvoiceListResponseSchema>;
