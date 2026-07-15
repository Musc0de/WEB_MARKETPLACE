# DAY-34 REPORT

## Features Implemented: Persistent Notifications, API, and SSE Stream

1. **Database Integration:**
   - Modified the worker system to process the `notification.create` outbox event.
   - Inserted records into the existing `sss_notifications` table.
   - Leveraged Drizzle's `onConflictDoNothing({ target: notifications.dedupeKey })` to guarantee idempotency and prevent duplicate notifications from being delivered to users.

2. **Redis Integration:**
   - Introduced `ioredis` to power high-performance real-time messaging.
   - Connected `redis.publish` in the worker to trigger instantaneous events across the entire cluster.
   - Appended Redis URL to `.env` and `.env.example`.

3. **Notification REST API (`GET /v1/notifications`):**
   - Implemented a paginated read endpoint utilizing `limit` and `offset` for high performance.
   - Implemented `unread-count` for fast badging on the client side.
   - Implemented `read` and `read-all` endpoints to mark notifications as read (populating `readAt` field with `now()`).

4. **SSE Realtime Streaming (`GET /v1/notifications/stream`):**
   - Configured `streamSSE` from Hono streaming tools.
   - Subscribed to the `user-notifications:${userId}` Redis Pub/Sub channel.
   - Stream emits standard `notification` events when changes happen.
   - Added a 15-second heartbeat interval emitting `ping` to ensure strict load balancers don't drop the connection.
   - Attached an `abort` controller to disconnect from Redis instantly when the user drops the connection, mitigating memory leaks.

## Quality & Tests
- Wrote API tests for routing resolution in `notifications.test.ts`.
- Wrote worker tests validating invalid payloads in `notifications.test.ts`.
- Validated clean integration through `deno check`.
- Ensured 100% adherence to Deno strict typings and authentication barriers via `AuthContext`.
