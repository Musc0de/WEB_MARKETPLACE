import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '../../middleware/validator.ts';
import { db, notifications } from '@starsuperscare/database';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { AuthContext, authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.ts';
import { streamSSE } from 'hono/streaming';
import { sseManager } from './sse.ts';

const app = new Hono<AuthContext>();

// Helper to send personal notification
export async function sendNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  actionUrl?: string,
  dataJson?: any,
) {
  // 1. Insert into DB
  const [record] = await db
    .insert(notifications)
    .values({
      userId,
      type,
      title,
      body,
      actionUrl,
      dataJson: dataJson || null,
    })
    .returning();

  // 2. Send via SSE
  sseManager.sendToUser(userId, 'notification', record);

  return record;
}

// Global broadcast
export function broadcastNotification(
  type: string,
  title: string,
  body: string,
  actionUrl?: string,
) {
  sseManager.broadcast('broadcast', { type, title, body, actionUrl });
}

// SSE Stream Endpoint (allows guests for global broadcasts)
app.get('/stream', optionalAuthMiddleware, (c) => {
  const user = c.get('user');

  return streamSSE(c, async (stream) => {
    // Generate unique ID for this connection
    const clientId = crypto.randomUUID();

    stream.onAbort(() => {
      sseManager.removeClient(clientId);
    });

    sseManager.addClient(clientId, stream, user?.id);

    // Keep alive until aborted
    while (true) {
      await stream.sleep(10000);
    }
  });
});

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

export default app;
