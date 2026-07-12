import { Context } from 'hono';

export const errorHandler = async (err: Error, c: Context) => {
  const reqId = c.get('requestId');
  const status = 'status' in err && typeof err.status === 'number' ? err.status : 500;

  // Log actual error on server securely
  console.error(
    JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      request_id: reqId,
      error: err.message,
      stack: err.stack,
    }),
  );

  return c.json(
    {
      data: null,
      meta: { request_id: reqId },
      error: {
        code: status === 500 ? 'INTERNAL_SERVER_ERROR' : 'UNKNOWN_ERROR',
        message: status === 500 ? 'An unexpected internal error occurred.' : err.message,
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
