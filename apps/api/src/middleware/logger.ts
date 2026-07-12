import { Context, Next } from 'hono';

export const structuredLogger = () => {
  return async (c: Context, next: Next) => {
    const reqId = c.get('requestId');
    const method = c.req.method;
    const path = c.req.path;
    const start = performance.now();

    await next();

    const ms = performance.now() - start;
    const status = c.res.status;

    console.log(
      JSON.stringify({
        level: status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO',
        timestamp: new Date().toISOString(),
        request_id: reqId,
        method,
        path,
        status,
        duration_ms: Math.round(ms * 100) / 100,
      }),
    );
  };
};
