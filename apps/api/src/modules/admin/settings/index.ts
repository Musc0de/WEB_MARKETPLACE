import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { z } from 'zod';
import { db, globalSettings } from '@starsuperscare/database';
import { eq } from 'drizzle-orm';
import { adminSettingsCampaignsRouter } from './campaigns.ts';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('catalog.write')); // Require an admin-level permission

app.route('/campaigns', adminSettingsCampaignsRouter);

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
      activeShippingGateway: z.string().optional(),
      shippingGatewayConfigs: z.record(
        z.string(),
        z.object({
          mode: z.enum(['sandbox', 'production']),
          config: z.any().optional(),
        }),
      ).optional(),
      storeOriginAddress: z.object({
        provinceId: z.string().optional(),
        cityId: z.string().optional(),
        districtId: z.string().optional(),
        villageCode: z.string().optional(),
        postalCode: z.string().optional(),
        fullAddress: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }).optional(),
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
    if (payload.activeShippingGateway !== undefined) {
      updatePayload.activeShippingGateway = payload.activeShippingGateway;
    }
    if (payload.shippingGatewayConfigs !== undefined) {
      updatePayload.shippingGatewayConfigs = payload.shippingGatewayConfigs;
    }
    if (payload.storeOriginAddress !== undefined) {
      updatePayload.storeOriginAddress = payload.storeOriginAddress;
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

// Proxy endpoints for api.co.id (Cek Ongkir & Regional)
app.get(
  '/shipping/villages',
  zValidator('query', z.object({ search: z.string() })),
  async (c) => {
    const { search } = c.req.valid('query');
    const apiKey = Deno.env.get('APICOID_API_KEY');
    const baseUrl = Deno.env.get('APICOID_API_URL');

    if (!apiKey) {
      return c.json({
        error: { message: 'API Key not configured in environment' },
        meta: { request_id: c.get('requestId') },
        data: null,
      }, 500);
    }

    try {
      // 1. Coba cari berdasarkan nama Kelurahan/Desa terlebih dahulu
      const villageRes = await fetch(
        `${baseUrl}/regional/indonesia/villages?name=${encodeURIComponent(search)}`,
        { headers: { 'x-api-co-id': apiKey } },
      );
      const villageData = await villageRes.json();
      let results = villageData.data || villageData.result || [];

      // 2. Jika tidak ada Kelurahan yang cocok, coba cari berdasarkan nama Kecamatan (District)
      if (results.length === 0) {
        const districtRes = await fetch(
          `${baseUrl}/regional/indonesia/districts?name=${encodeURIComponent(search)}`,
          { headers: { 'x-api-co-id': apiKey } },
        );
        const districtData = await districtRes.json();
        const districts = districtData.data || districtData.result || [];

        // 3. Jika ketemu kecamatannya, ambil daftar kelurahan/desa di kecamatan tersebut
        if (districts.length > 0) {
          const firstDistrict = districts[0];
          const distVillagesRes = await fetch(
            `${baseUrl}/regional/indonesia/districts/${firstDistrict.code}/villages`,
            { headers: { 'x-api-co-id': apiKey } },
          );
          const distVillagesData = await distVillagesRes.json();
          results = distVillagesData.data || distVillagesData.result || [];
        }
      }

      return c.json({
        data: {
          is_success: true,
          status: 'success',
          result: results,
        },
        meta: { request_id: c.get('requestId') },
        error: null,
      });
    } catch (e: any) {
      return c.json({
        error: { message: 'Failed to fetch regional data', details: e.message },
        meta: { request_id: c.get('requestId') },
        data: null,
      }, 500);
    }
  },
);

app.get(
  '/shipping/cost',
  zValidator(
    'query',
    z.object({
      origin_village_code: z.string(),
      destination_village_code: z.string(),
      weight: z.string(),
    }),
  ),
  async (c) => {
    const query = c.req.valid('query');
    const apiKey = Deno.env.get('APICOID_API_KEY');
    const baseUrl = Deno.env.get('APICOID_API_URL');

    if (!apiKey) {
      return c.json({
        error: { message: 'API Key not configured in environment' },
        meta: { request_id: c.get('requestId') },
        data: null,
      }, 500);
    }

    try {
      const url =
        `${baseUrl}/expedition/shipping-cost?origin_village_code=${query.origin_village_code}&destination_village_code=${query.destination_village_code}&weight=${query.weight}`;
      const response = await fetch(url, {
        headers: { 'x-api-co-id': apiKey },
      });
      const data = await response.json();
      return c.json({ data, meta: { request_id: c.get('requestId') }, error: null });
    } catch (e: any) {
      return c.json({
        error: { message: 'Failed to fetch shipping cost', details: e.message },
        meta: { request_id: c.get('requestId') },
        data: null,
      }, 500);
    }
  },
);

export { app as adminSettingsRouter };
