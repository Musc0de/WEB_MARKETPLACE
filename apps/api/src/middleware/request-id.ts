import { Context, Next } from 'hono';

export const requestId = () => {
  return async (c: Context, next: Next) => {
    const existing = c.req.header('X-Request-Id');
    const id = existing || crypto.randomUUID();
    c.set('requestId', id);
    c.res.headers.set('X-Request-Id', id);
    await next();
  };
};
