import { db, notifications, redis } from '@starsuperscare/database';
import { z } from 'zod';
import { alertOnFailure, recordMetric } from '../observability/metrics.ts';

const NotificationCreateSchema = z.object({
  userId: z.string().uuid().nullable().optional(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  actionUrl: z.string().optional(),
  dataJson: z.record(z.string(), z.any()).optional(),
  dedupeKey: z.string(),
});

export const handleNotificationCreate = async (payload: unknown) => {
  const parsed = NotificationCreateSchema.safeParse(payload);
  if (!parsed.success) {
    alertOnFailure('notification_create', `Invalid payload: ${parsed.error.message}`, 'medium');
    throw new Error(`Invalid notification payload: ${parsed.error.message}`);
  }

  const { userId, type, title, body, actionUrl, dataJson, dedupeKey } = parsed.data;

  // If no user is associated (e.g. guest order), we can't create a user notification.
  if (!userId) {
    console.log(`[Notification] Skipped for null user_id (type: ${type})`);
    return;
  }

  // Insert notification, ignore if dedupeKey exists
  const [notification] = await db
    .insert(notifications)
    .values({
      userId,
      type,
      title,
      body,
      actionUrl: actionUrl || null,
      dataJson: dataJson || null,
      dedupeKey,
    })
    .onConflictDoNothing({ target: notifications.dedupeKey })
    .returning();

  if (notification) {
    // Publish to Redis so SSE stream can pick it up instantly
    try {
      const channel = `user-notifications:${userId}`;
      await redis.publish(channel, JSON.stringify(notification));
      recordMetric('notification_published_success', 1, { type });
    } catch (err: any) {
      alertOnFailure('notification_publish', `Redis publish failed: ${err.message}`, 'high');
      throw err;
    }
  }
};
