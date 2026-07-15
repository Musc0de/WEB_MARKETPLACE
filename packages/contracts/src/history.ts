// deno-lint-ignore-file explicit-module-boundary-types
import { z } from 'zod';
import { PaginationSchema } from './http.ts';

const _historyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(5),
  status: z.string().optional(),
  year: z.coerce.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const historyQuerySchema: typeof _historyQuerySchema = _historyQuerySchema;
export type HistoryQuery = z.infer<typeof _historyQuerySchema>;

const _historySummarySchema = z.object({
  totalTransactions: z.number(),
  totalNominal: z.number(),
  completedCount: z.number(),
  refundCount: z.number(),
  refundNominal: z.number(),
});

export const historySummarySchema: typeof _historySummarySchema = _historySummarySchema;
export type HistorySummary = z.infer<typeof _historySummarySchema>;

const _historyResponseSchema = z.object({
  items: z.array(z.any()),
  summary: _historySummarySchema,
  pagination: PaginationSchema,
});

export const historyResponseSchema: typeof _historyResponseSchema = _historyResponseSchema;
export type HistoryResponse = z.infer<typeof _historyResponseSchema>;
