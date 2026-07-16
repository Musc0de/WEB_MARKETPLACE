import { Hono } from 'hono';
import { db, globalSettings } from '@starsuperscare/database';

import { eq } from 'drizzle-orm';

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

export { app as settingsRouter };
