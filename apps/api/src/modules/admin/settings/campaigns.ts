import { Hono } from 'hono';
import { zValidator } from '../../../middleware/validator.ts';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';
import { z } from 'zod';
import { campaignBanners, db } from '@starsuperscare/database';
import { desc, eq } from 'drizzle-orm';
import { storage } from '@starsuperscare/storage';

const app = new Hono<AuthContext>();

app.use('/*', authMiddleware);
app.use('/*', requirePermission('catalog.write')); // Requires admin level permission

// GET /v1/admin/settings/campaigns
app.get('/', async (c) => {
  const banners = await db.select().from(campaignBanners).orderBy(
    desc(campaignBanners.priority),
    desc(campaignBanners.createdAt),
  );
  return c.json({
    data: banners,
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// POST /v1/admin/settings/campaigns
app.post(
  '/',
  zValidator(
    'json',
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      description: z.string().optional(),
      theme: z.enum(['light', 'dark', 'primary']).default('primary'),
      badge: z.string().optional(),
      primaryCtaLabel: z.string().optional(),
      primaryCtaHref: z.string().optional(),
      primaryCtaColor: z.string().optional(),
      secondaryCtaLabel: z.string().optional(),
      secondaryCtaHref: z.string().optional(),
      secondaryCtaColor: z.string().optional(),
      desktopImageUrl: z.string().optional(),
      mobileImageUrl: z.string().optional(),
      isActive: z.boolean().default(true),
      priority: z.number().default(0),
    }),
  ),
  async (c) => {
    const payload = c.req.valid('json');
    const [result] = await db.insert(campaignBanners).values(payload).returning();

    return c.json({
      data: result,
      meta: { request_id: c.get('requestId') },
      error: null,
    }, 201);
  },
);

// PUT /v1/admin/settings/campaigns/:id
app.put(
  '/:id',
  zValidator(
    'json',
    z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      theme: z.enum(['light', 'dark', 'primary']).optional(),
      badge: z.string().optional(),
      primaryCtaLabel: z.string().optional(),
      primaryCtaHref: z.string().optional(),
      primaryCtaColor: z.string().optional(),
      secondaryCtaLabel: z.string().optional(),
      secondaryCtaHref: z.string().optional(),
      secondaryCtaColor: z.string().optional(),
      desktopImageUrl: z.string().optional(),
      mobileImageUrl: z.string().optional(),
      isActive: z.boolean().optional(),
      priority: z.number().optional(),
    }),
  ),
  async (c) => {
    const id = c.req.param('id');
    const payload = c.req.valid('json');

    const [result] = await db.update(campaignBanners)
      .set({ ...payload, updatedAt: new Date().toISOString() })
      .where(eq(campaignBanners.id, id))
      .returning();

    if (!result) {
      return c.json({ error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, 404);
    }

    return c.json({
      data: result,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

// DELETE /v1/admin/settings/campaigns/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const [result] = await db.delete(campaignBanners).where(eq(campaignBanners.id, id)).returning();

  if (!result) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, 404);
  }

  return c.json({
    data: { success: true },
    meta: { request_id: c.get('requestId') },
    error: null,
  });
});

// POST /v1/admin/settings/campaigns/upload
// Upload an image for a banner (desktop or mobile)
app.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    const type = body['type'] as string; // 'desktop' or 'mobile'

    if (!file || typeof file === 'string' || !('name' in file)) {
      return c.json({ error: { code: 'INVALID_INPUT', message: 'No file uploaded' } }, 400);
    }

    if (type !== 'desktop' && type !== 'mobile') {
      return c.json(
        { error: { code: 'INVALID_INPUT', message: 'Type must be desktop or mobile' } },
        400,
      );
    }

    const uploadedFile = file as unknown as File;
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const folder = type === 'desktop' ? 'banner_dekstop' : 'banner_mobile';
    const filename = `${crypto.randomUUID()}.${ext}`;
    const key = `${folder}/${filename}`;

    const arrayBuffer = await uploadedFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    await storage.putObject(key, uint8Array, uploadedFile.type || 'image/jpeg');
    const url = await storage.getSignedUrl(key, 86400 * 365); // 1 year approx

    return c.json({
      data: { url, key },
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  } catch (err: any) {
    return c.json({ error: { code: 'UPLOAD_FAILED', message: err.message } }, 500);
  }
});

export { app as adminSettingsCampaignsRouter };
