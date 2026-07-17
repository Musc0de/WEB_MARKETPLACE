import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '../../middleware/validator.ts';
import { createRedisSubscriber, db, notifications } from '@starsuperscare/database';
import { streamSSE } from 'hono/streaming';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { AuthContext, authMiddleware } from '../../middleware/auth.ts';

const app = new Hono<AuthContext>();

// All routes require authentication
app.use('*', authMiddleware);

// GET /v1/notifications
app.get(
  '/',
  zValidator(
    'query',
    z.object({
      limit: z.coerce.number().min(1).max(100).default(50),
      offset: z.coerce.number().min(0).default(0),
    }),
  ),
  async (c) => {
    const { limit, offset } = c.req.valid('query');
    const userId = c.get('user').id;

    const items = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      limit,
      offset,
      orderBy: [desc(notifications.createdAt)],
    });

    return c.json({ data: items, meta: { limit, offset } });
  },
);

// GET /v1/notifications/unread-count
app.get('/unread-count', async (c) => {
  const userId = c.get('user').id;
  const results = await db.select().from(notifications).where(
    and(eq(notifications.userId, userId), isNull(notifications.readAt)),
  );
  return c.json({ data: { count: results.length } });
});

// POST /v1/notifications/:id/read
app.post('/:id/read', async (c) => {
  const userId = c.get('user').id;
  const notificationId = c.req.param('id');

  const [updated] = await db
    .update(notifications)
    .set({ readAt: new Date().toISOString() })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
    .returning();

  if (!updated) {
    return c.json({ error: 'Notification not found' }, 404);
  }

  return c.json({ data: updated });
});

// POST /v1/notifications/read-all
app.post('/read-all', async (c) => {
  const userId = c.get('user').id;

  await db
    .update(notifications)
    .set({ readAt: new Date().toISOString() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

  return c.json({ data: { success: true } });
});

// GET /v1/notifications/stream
app.get('/stream', (c) => {
  const userId = c.get('user').id;

  return streamSSE(c, async (stream) => {
    const subscriber = createRedisSubscriber();
    const channel = `user-notifications:${userId}`;

    await subscriber.subscribe(channel);

    subscriber.on('message', async (chan: string, message: string) => {
      if (chan === channel) {
        try {
          const payload = JSON.parse(message);
          await stream.writeSSE({
            data: JSON.stringify(payload),
            event: 'notification',
            id: payload.id,
          });
        } catch (e) {
          console.error('Failed to stream notification:', e);
        }
      }
    });

    const heartbeatInterval = setInterval(async () => {
      try {
        await stream.writeSSE({
          data: 'ping',
          event: 'heartbeat',
        });
      } catch (_e) {
        clearInterval(heartbeatInterval);
        subscriber.disconnect();
      }
    }, 15000);

    stream.onAbort(() => {
      clearInterval(heartbeatInterval);
      subscriber.disconnect();
    });

    // Keep the stream alive until abort
    while (true) {
      try {
        await stream.sleep(1000);
      } catch {
        break; // stream is aborted
      }
    }
  });
});

export default app;
