import { Hono } from 'hono';
import profileRouter from './profile.ts';
import securityRouter from './security.ts';
import addressesRouter from './addresses.ts';
import paymentMethodsRouter from './payment-methods.ts';

const app = new Hono();

const routes = app
  .route('/profile', profileRouter)
  .route('/security', securityRouter)
  .route('/addresses', addressesRouter)
  .route('/payment-methods', paymentMethodsRouter);

export default routes;
