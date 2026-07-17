import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { z } from 'zod';
import { db, globalSettings } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('catalog.write')); // Require an admin-level permission

app.get('/', async (c) => {
  const appId = c.req.query('app') || '';
  const [settings] = await db.select().from(globalSettings).where(eq(globalSettings.id, appId))
    .limit(1);
  return c.json({
    data: settings ||
      {
        siteTitle: null,
        siteDescription: null,
        faviconUrl: null,
        activePaymentGateway: 'sandbox',
        paymentGatewayConfigs: {},
      },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

app.put(
  '/',
  zValidator(
    'json',
    z.object({
      appId: z.string().min(1),
      siteTitle: z.string().optional(),
      siteDescription: z.string().nullable().optional(),
      faviconUrl: z.string().nullable().optional(),
      activePaymentGateway: z.string().optional(),
      paymentGatewayConfigs: z.record(
        z.string(),
        z.object({
          mode: z.enum(['sandbox', 'production']),
          config: z.any().optional(),
        }),
      ).optional(),
    }),
  ),
  async (c) => {
    const payload = c.req.valid('json');
    const [existing] = await db.select().from(globalSettings).where(
      eq(globalSettings.id, payload.appId),
    ).limit(1);

    const updatePayload: any = { updatedAt: new Date().toISOString() };
    if (payload.siteTitle !== undefined) updatePayload.siteTitle = payload.siteTitle;
    if (payload.siteDescription !== undefined) {
      updatePayload.siteDescription = payload.siteDescription;
    }
    if (payload.faviconUrl !== undefined) updatePayload.faviconUrl = payload.faviconUrl;
    if (payload.activePaymentGateway !== undefined) {
      updatePayload.activePaymentGateway = payload.activePaymentGateway;
    }
    if (payload.paymentGatewayConfigs !== undefined) {
      updatePayload.paymentGatewayConfigs = payload.paymentGatewayConfigs;
    }

    let result;
    if (existing) {
      [result] = await db.update(globalSettings)
        .set(updatePayload)
        .where(eq(globalSettings.id, existing.id))
        .returning();
    } else {
      [result] = await db.insert(globalSettings)
        .values({
          id: payload.appId,
          ...updatePayload,
        })
        .returning();
    }

    return c.json({
      data: result,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export { app as adminSettingsRouter };
