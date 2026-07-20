import { Hono } from 'hono';
import { requestId } from './middleware/request-id.ts';
import { structuredLogger } from './middleware/logger.ts';
import { errorHandler, notFoundHandler } from './middleware/error-handler.ts';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { csrfProtection } from './middleware/csrf.ts';
import { rateLimiter } from './middleware/rate-limiter.ts';
import { browserNavigationShield } from './middleware/browser-shield.ts';
import { db } from '@starsuperscare/database';
import { sql } from 'drizzle-orm';
import authRouter from './routes/v1/auth.ts';
import catalogRouter from './routes/v1/catalog.ts';
import cartRouter from './routes/v1/cart.ts';
import adminCatalogRouter from './routes/v1/admin/catalog.ts';
import adminAssetsRouter from './modules/admin/assets/assets.ts';
import adminInventoryRouter from './modules/admin/inventory/admin-inventory.ts';
import { checkoutRouter } from './modules/checkout/checkout.ts';
import { wishlistRouter } from './modules/wishlist/wishlist.ts';
import { vouchersRoutes } from './routes/v1/vouchers.ts';
import { paymentsRouter } from './modules/payments/payments.ts';
import { webhooksRouter } from './routes/v1/webhooks.ts';
import notificationsRouter from './modules/notifications/index.ts';
import historyRouter from './modules/history/index.ts';
import invoicesRouter from './modules/invoices/index.ts';
import downloadsRouter from './modules/downloads/index.ts';
import { home as dashboardHomeRouter } from './modules/dashboard/home.ts';
import meRouter from './modules/me/index.ts';
import ordersRouter from './modules/orders/index.ts';
import { reviewsRouter } from './modules/reviews/index.ts';
import { returnsRouter } from './modules/returns/index.ts';
import supportRouter from './modules/support/index.ts';
import trackingRouter from './modules/tracking/index.ts';
import shippingWebhookRouter from './modules/shipping/webhook.ts';

import { adminReturnsRouter } from './modules/admin/returns/index.ts';
import { adminRefundsRouter } from './modules/admin/refunds/index.ts';
import adminSupportRouter from './modules/admin/support/index.ts';
import { adminOrdersRouter } from './modules/admin/orders/index.ts';
import { adminCustomersRouter } from './modules/admin/customers/index.ts';
import { adminPaymentsRouter } from './modules/admin/payments/index.ts';
import adminReviewsRouter from './modules/admin/reviews/index.ts';
import adminAuditRouter from './modules/admin/audit/index.ts';
import adminReportsRouter from './modules/admin/reports/index.ts';
import adminOverviewRouter from './modules/admin/overview/index.ts';
import { adminVouchersRouter } from './modules/admin/vouchers/index.ts';
import { adminSettingsRouter } from './modules/admin/settings/index.ts';
import { settingsRouter } from './modules/settings/index.ts';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const app = new Hono<AppContext>();

// Global Middlewares
// Parse ALLOWED_ORIGINS
const allowedOriginsStr =
  (typeof Deno !== 'undefined'
    ? Deno.env.get('ALLOWED_ORIGINS')
    : process?.env?.['ALLOWED_ORIGINS']) || '';
const allowedOrigins = allowedOriginsStr.split(',').map((o) => o.trim()).filter(Boolean);

// Custom static file handler for /storage
import * as path from 'node:path';
app.use('*', requestId());
app.use('*', structuredLogger());

app.get('/storage-test', (c) => c.text('OK_RESTARTED'));

app.get('/storage/*', async (c) => {
  const reqPath = c.req.path; // e.g. /storage/invoices/...
  // Resolve workspace root from apps/api/src
  const workspaceRoot = path.join(import.meta.dirname!, '..', '..', '..');
  const filePath = path.join(workspaceRoot, 'data', reqPath);

  try {
    const file = await Deno.open(filePath, { read: true });

    // Determine content type based on extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';

    c.header('Content-Type', contentType);

    // Use standard Web Streams API as expected by Hono's body()
    return c.body(file.readable);
  } catch (_e) {
    return c.text('File not found', 404);
  }
});

// Configure Hono to use standard Web Streams for streaming responses
app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  }),
);
app.use('*', csrfProtection(allowedOrigins));
app.use('*', rateLimiter({ limit: 100, windowMs: 10000 })); // Global 100 req per 10s

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0] || '*';
      if (allowedOrigins.includes(origin)) return origin;
      return null; // reject
    },
    allowHeaders: [
      'X-Custom-Header',
      'Upgrade-Insecure-Requests',
      'Content-Type',
      'Authorization',
      'X-Cart-Token',
      'X-Direct-Buy-Token',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
    credentials: true,
  }),
);

// Block direct browser navigation to API routes (except exempt ones)
app.use('*', browserNavigationShield);

// System Routes
app.get('/health', (c) => {
  return c.json({
    data: { status: 'healthy', timestamp: new Date().toISOString() },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

app.get('/ready', async (c) => {
  try {
    await db.execute(sql`SELECT 1`);
    return c.json({
      data: { status: 'ready', timestamp: new Date().toISOString() },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  } catch (err) {
    return c.json({
      data: null,
      meta: { request_id: c.get('requestId') },
      error: { message: 'Database connection failed', details: err },
    }, 503);
  }
});

// Domain Routes
const v1 = new Hono<AppContext>()
  .get('/', (c) => c.text('404 Not Found'))
  .post('/test-csrf', (c) => c.json({ data: 'success', error: null }))
  .use('/auth/*', rateLimiter({ limit: 10, windowMs: 30000 })) // Stricter limit on auth routes
  .route('/auth', authRouter)
  .route('/catalog', catalogRouter)
  .route('/cart', cartRouter)
  .route('/checkout', checkoutRouter)
  .route('/wishlist', wishlistRouter)
  .route('/vouchers', vouchersRoutes)
  .route('/payments', paymentsRouter)
  .route('/webhooks/payments', webhooksRouter)
  .route('/webhooks/shipping', shippingWebhookRouter)
  .route('/tracking', trackingRouter)
  .route('/notifications', notificationsRouter)
  .route('/history', historyRouter)
  .route('/invoices', invoicesRouter)
  .route('/downloads', downloadsRouter)
  .route('/me', meRouter)
  .route('/orders', ordersRouter)
  .route('/reviews', reviewsRouter)
  .route('/returns', returnsRouter)
  .route('/support', supportRouter)
  .route('/settings', settingsRouter)
  .route(
    '/dashboard',
    new Hono<AppContext>().route('/home', dashboardHomeRouter),
  )
  .route(
    '/admin',
    new Hono()
      .route('/catalog', adminCatalogRouter)
      .route('/assets', adminAssetsRouter)
      .route('/inventory', adminInventoryRouter)
      .route('/returns', adminReturnsRouter)
      .route('/refunds', adminRefundsRouter)
      .route('/support', adminSupportRouter)
      .route('/vouchers', adminVouchersRouter)
      .route('/orders', adminOrdersRouter)
      .route('/customers', adminCustomersRouter)
      .route('/payments', adminPaymentsRouter)
      .route('/reviews', adminReviewsRouter)
      .route('/audit', adminAuditRouter)
      .route('/reports', adminReportsRouter)
      .route('/overview', adminOverviewRouter)
      .route('/settings', adminSettingsRouter),
  );

const routes = app.route('/v1', v1);

export type AppType = typeof routes;

// Error and Not Found Handlers
app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
