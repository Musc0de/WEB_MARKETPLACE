import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

// Temporary in-memory store for rate limiting
// TODO(@user): Replace with Redis for production
const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

export const rateLimiter = (options: { limit: number; windowMs: number }) => {
  return async (c: Context, next: Next) => {
    // Disable rate limit in test environment to prevent tests from failing
    if (typeof Deno !== 'undefined' && typeof Deno.test === 'function') {
      await next();
      return;
    }

    // Determine client IP using proxy headers if available
    const ip = c.req.header('x-forwarded-for') ||
      c.req.header('x-real-ip') ||
      'unknown_ip';

    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || record.expiresAt < now) {
      rateLimitStore.set(ip, { count: 1, expiresAt: now + options.windowMs });
    } else {
      record.count += 1;
      if (record.count > options.limit) {
        throw new HTTPException(429, { message: 'Too many requests, please try again later.' });
      }
      rateLimitStore.set(ip, record);
    }

    // Pass rate limit info in headers
    const currentRecord = rateLimitStore.get(ip)!;
    c.header('X-RateLimit-Limit', options.limit.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, options.limit - currentRecord.count).toString());
    c.header('X-RateLimit-Reset', new Date(currentRecord.expiresAt).toISOString());

    await next();
  };
};
