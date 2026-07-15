import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { Hono } from 'hono';
import orderClaimRouter from './order-claim.ts';

describe('Auth - Order Claim', () => {
  it('should be defined', () => {
    const app = new Hono();
    app.route('/claim', orderClaimRouter);
    expect(app).toBeDefined();
  });
});
