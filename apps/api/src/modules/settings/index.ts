import { Hono } from 'hono';
import { db, globalSettings } from '@starsuperscare/database';

const app = new Hono();

app.get('/', async (c) => {
  const [settings] = await db.select().from(globalSettings).limit(1);
  return c.json({
    data: settings ||
      { siteTitle: 'StarSuperScare Marketplace', siteDescription: null, faviconUrl: null },
    error: null,
  });
});

export { app as settingsRouter };
