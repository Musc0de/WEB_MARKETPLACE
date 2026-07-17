import { Hono } from 'hono';
import categoriesRouter from '../../../modules/admin/catalog/categories.ts';
import brandsRouter from '../../../modules/admin/catalog/brands.ts';
import productsRouter from '../../../modules/admin/catalog/products.ts';
import credentialsRouter from '../../../modules/admin/catalog/credentials.ts';

const adminCatalogRouter = new Hono();

const routes = adminCatalogRouter
  .route('/categories', categoriesRouter)
  .route('/brands', brandsRouter)
  .route('/products', productsRouter)
  .route('/credentials', credentialsRouter);

export default routes;
