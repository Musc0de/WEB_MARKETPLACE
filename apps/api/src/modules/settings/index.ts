import { Hono } from 'hono';
import { db, globalSettings } from '@starsuperscare/database';

import { desc, eq } from 'drizzle-orm';
import { campaignBanners } from '@starsuperscare/database';

const app = new Hono();

app.get('/', async (c) => {
  const appId = c.req.query('app') || '';
  const [settings] = await db.select().from(globalSettings).where(eq(globalSettings.id, appId))
    .limit(1);
  return c.json({
    data: settings ||
      { siteTitle: null, siteDescription: null, faviconUrl: null },
    error: null,
  });
});

app.get('/campaigns', async (c) => {
  const activeBanners = await db.select()
    .from(campaignBanners)
    .where(eq(campaignBanners.isActive, true))
    .orderBy(desc(campaignBanners.priority), desc(campaignBanners.createdAt));

  return c.json({
    data: activeBanners,
    error: null,
  });
});

export { app as settingsRouter };
