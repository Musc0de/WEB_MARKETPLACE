import { Hono } from 'hono';
import { categories, db } from '@starsuperscare/database';
import { desc } from 'drizzle-orm';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const categoriesRouter = new Hono<AppContext>();

const routes = categoriesRouter.get(
  '/',
  async (c) => {
    const allCategories = await db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    });

    return c.json({
      data: allCategories,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export default routes;
