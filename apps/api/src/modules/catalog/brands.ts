import { Hono } from 'hono';
import { brands, db } from '@starsuperscare/database';
import { desc } from 'drizzle-orm';

type AppContext = {
  Variables: {
    requestId: string;
  };
};

const brandsRouter = new Hono<AppContext>();

const routes = brandsRouter.get(
  '/',
  async (c) => {
    const allBrands = await db.query.brands.findMany({
      orderBy: [desc(brands.createdAt)],
    });

    return c.json({
      data: allBrands,
      meta: { request_id: c.get('requestId') },
      error: null,
    });
  },
);

export default routes;
