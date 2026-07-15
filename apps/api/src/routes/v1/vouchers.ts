import { Hono } from 'hono';
import { vouchersRouter } from '../../modules/vouchers/vouchers.ts';

export const vouchersRoutes = new Hono().route('/', vouchersRouter);
