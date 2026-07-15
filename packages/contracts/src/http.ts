import { z } from 'zod';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  requestId?: string;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  meta?: Record<string, unknown> | PaginatedMeta;
  error: ApiError | null;
}

// Zod schemas for validation
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
