import { Hono } from 'hono';
import products from '../../modules/catalog/products.ts';
import categories from '../../modules/catalog/categories.ts';
import brands from '../../modules/catalog/brands.ts';
import reviews from '../../modules/reviews/read.ts';

const catalogRouter = new Hono();

const routes = catalogRouter
  .route('/', reviews)
  .route('/products', products)
  .route('/categories', categories)
  .route('/brands', brands);

export default routes;
