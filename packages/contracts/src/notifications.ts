// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';
import { PaginationSchema } from './http.ts';

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl: string | null;
  dataJson: any | null;
  readAt: string | null;
  createdAt: string;
}

export const notificationItemSchema: z.ZodType<NotificationItem> = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  actionUrl: z.string().nullable(),
  dataJson: z.any().nullable(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export interface NotificationListResponse {
  data: NotificationItem[];
  meta?: any;
  error: string | null;
}

export const notificationListResponseSchema: z.ZodType<NotificationListResponse> = z.object({
  data: z.array(notificationItemSchema),
  meta: PaginationSchema.optional(),
  error: z.string().nullable(),
});
