import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { Hono } from 'hono';
import notificationsRouter from './index.ts';

describe('API - Notifications', () => {
  it('should be defined', () => {
    const app = new Hono();
    app.route('/notifications', notificationsRouter);
    expect(app).toBeDefined();
  });
});
