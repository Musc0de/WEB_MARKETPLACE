import { z } from 'zod';

export const adminCustomerListItemSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  status: z.enum(['active', 'suspended', 'banned']),
  createdAt: z.string(),
});
export type AdminCustomerListItem = z.infer<typeof adminCustomerListItemSchema>;

export const adminCustomerListResponseSchema = z.object({
  data: z.array(adminCustomerListItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type AdminCustomerListResponse = z.infer<typeof adminCustomerListResponseSchema>;

export const adminCustomerDetailResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  status: z.enum(['active', 'suspended', 'banned']),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().nullable(),

  orderCount: z.number(),
  totalSpent: z.number(),
});
export type AdminCustomerDetailResponse = z.infer<typeof adminCustomerDetailResponseSchema>;
