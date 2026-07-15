import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler = (err: Error, c: Context) => {
  const reqId = c.get('requestId');

  // Default to 500
  let status = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal error occurred.';
  let details: unknown = undefined;

  if (err instanceof HTTPException) {
    status = err.status;
    code = status === 401
      ? 'UNAUTHORIZED'
      : status === 403
      ? 'FORBIDDEN'
      : status === 404
      ? 'NOT_FOUND'
      : status === 400
      ? 'BAD_REQUEST'
      : 'ERROR';
    message = err.message;
  } else if (err.name === 'ZodError') {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request parameters.';
    // Attempt to extract issues if it's a ZodError
    details = (err as any).issues || (err as any).errors;
  }

  // Log actual error on server securely for 5xx errors
  if (status >= 500) {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        request_id: reqId,
        error: err.message,
        stack: err.stack,
      }),
    );
  }

  return c.json(
    {
      data: null,
      meta: { request_id: reqId },
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    status as any,
  );
};

export const notFoundHandler = (c: Context) => {
  const reqId = c.get('requestId');
  return c.json(
    {
      data: null,
      meta: { request_id: reqId },
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource could not be found.',
      },
    },
    404,
  );
};
