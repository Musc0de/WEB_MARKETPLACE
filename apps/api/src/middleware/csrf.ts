import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Custom CSRF middleware that strictly checks Origin and Referer
 * for state-changing methods.
 * Allows requests with no Origin/Referer if they don't use cookies (e.g. mobile app with bearer token).
 * But if it's a browser (has Origin or Referer), it MUST match allowed origins.
 */
export const csrfProtection = (allowedOrigins: string[]) => {
  return async (c: Context, next: Next) => {
    const method = c.req.method;

    // Only protect state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const origin = c.req.header('Origin');
      const referer = c.req.header('Referer');

      // If the request has an origin, check it
      if (origin && !allowedOrigins.includes(origin)) {
        if (!origin.startsWith('http://localhost:') && !origin.startsWith('http://127.0.0.1:')) {
          throw new HTTPException(403, { message: 'CSRF token mismatch or invalid origin' });
        }
      }

      // If no origin but has referer, check referer
      if (!origin && referer) {
        try {
          const refererUrl = new URL(referer);
          if (!allowedOrigins.includes(refererUrl.origin)) {
            if (
              !refererUrl.origin.startsWith('http://localhost:') &&
              !refererUrl.origin.startsWith('http://127.0.0.1:')
            ) {
              throw new HTTPException(403, { message: 'CSRF token mismatch or invalid referer' });
            }
          }
        } catch (_e) {
          throw new HTTPException(403, { message: 'Invalid referer header' });
        }
      }
    }

    await next();
  };
};
