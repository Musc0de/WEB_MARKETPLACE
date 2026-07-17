import { z } from 'zod';

export const PaymentIntentRequestSchema = z.object({
  orderId: z.string().uuid(),
  paymentType: z.string().optional(), // 'VA', 'QRIS', 'EWALLET'
});

export const PaymentIntentResponseSchema = z.object({
  paymentId: z.string().uuid(),
  providerTransactionId: z.string(),
  clientSecret: z.string().optional(), // Optional for Louvin
  amount: z.number().int(),
  currency: z.string(),
  status: z.string(),
  instructionPayload: z.any().optional(), // QR string or VA details
  expiresAt: z.string().optional(),
});

export type PaymentIntentRequest = z.infer<typeof PaymentIntentRequestSchema>;
export type PaymentIntentResponse = z.infer<typeof PaymentIntentResponseSchema>;

// Standardize Webhook Payload
export const WebhookPayloadSchema = z.object({
  providerEventId: z.string(),
  type: z.enum([
    'payment_success',
    'payment_failed',
    'payment_expired',
    'payment.settled',
    'payment.failed',
    'payment.expired',
  ]), // Added Louvin types
  data: z.object({
    providerTransactionId: z.string(),
    orderId: z.string().uuid().optional(),
  }),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
