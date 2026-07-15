import { z } from 'zod';

export const PaymentIntentRequestSchema = z.object({
  orderId: z.string().uuid(),
});

export const PaymentIntentResponseSchema = z.object({
  paymentId: z.string().uuid(),
  providerTransactionId: z.string(),
  clientSecret: z.string(),
  amount: z.number().int(),
  currency: z.string(),
  status: z.string(),
});

export type PaymentIntentRequest = z.infer<typeof PaymentIntentRequestSchema>;
export type PaymentIntentResponse = z.infer<typeof PaymentIntentResponseSchema>;

export const WebhookPayloadSchema = z.object({
  providerEventId: z.string(),
  type: z.enum(['payment_success', 'payment_failed']),
  data: z.object({
    providerTransactionId: z.string(),
    orderId: z.string().uuid(),
  }),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
