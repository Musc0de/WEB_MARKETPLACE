import { Hono } from 'hono';
import { requestId } from './middleware/request-id.ts';
import { structuredLogger } from './middleware/logger.ts';
import { errorHandler, notFoundHandler } from './middleware/error-handler.ts';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const app = new Hono<AppContext>();

// Global Middlewares
app.use('*', requestId());
app.use('*', structuredLogger());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: '*', // TODO: configure strict origins
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
    credentials: true,
  }),
);

// System Routes
app.get('/health', (c) => {
  return c.json({
    data: { status: 'healthy', timestamp: new Date().toISOString() },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

app.get('/ready', (c) => {
  // TODO: Add database connection check
  return c.json({
    data: { status: 'ready', timestamp: new Date().toISOString() },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// Domain Routes
const v1 = new Hono<AppContext>();

// Placeholder for real routes
v1.get(
  '/',
  (c) =>
    c.json({
      data: 'Welcome to StarSuperScare API v1',
      meta: { request_id: c.get('requestId') },
      error: null,
    }),
);

app.route('/v1', v1);

// Error and Not Found Handlers
app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
