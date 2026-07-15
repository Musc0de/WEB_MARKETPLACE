import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, desc, eq, gte, lte, SQL } from 'drizzle-orm';
import { db, securityAuditLogs, systemAuditLogs, users } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const FilterSchema = z.object({
  type: z.enum(['system', 'security']).default('system'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  actorId: z.string().uuid().optional(),
  limit: z.string().optional(),
});

const routes = app
  .use('*', authMiddleware)
  .get(
    '/',
    requirePermission('settings.read'),
    zValidator('query', FilterSchema),
    async (c) => {
      const { type, startDate, endDate, actorId, limit: limitStr } = c.req.valid('query');
      const limit = Math.min(Number(limitStr ?? 100), 100);

      const conditions: SQL[] = [];
      if (startDate) {
        conditions.push(
          gte(
            type === 'system' ? systemAuditLogs.createdAt : securityAuditLogs.createdAt,
            new Date(startDate).toISOString(),
          ),
        );
      }
      if (endDate) {
        conditions.push(
          lte(
            type === 'system' ? systemAuditLogs.createdAt : securityAuditLogs.createdAt,
            new Date(endDate).toISOString(),
          ),
        );
      }

      if (type === 'system') {
        if (actorId) conditions.push(eq(systemAuditLogs.actorId, actorId));

        // Use leftJoin instead of db.query.findMany with 'with' to avoid missing relations error
        const logs = await db
          .select({
            id: systemAuditLogs.id,
            entityType: systemAuditLogs.entityType,
            entityId: systemAuditLogs.entityId,
            action: systemAuditLogs.action,
            actorId: systemAuditLogs.actorId,
            changes: systemAuditLogs.changes,
            createdAt: systemAuditLogs.createdAt,
            actorUsername: users.usernameDisplay,
            actorEmail: users.emailDisplay,
          })
          .from(systemAuditLogs)
          .leftJoin(users, eq(systemAuditLogs.actorId, users.id))
          .where(and(...conditions))
          .orderBy(desc(systemAuditLogs.createdAt))
          .limit(limit);

        // Redact sensitive data from changes
        const redactedLogs = logs.map((log) => {
          let redactedChanges = log.changes;
          if (log.entityType === 'user' && redactedChanges && typeof redactedChanges === 'object') {
            redactedChanges = JSON.parse(JSON.stringify(redactedChanges));
            if ((redactedChanges as any).after?.passwordHash) {
              (redactedChanges as any).after.passwordHash = '[REDACTED]';
            }
          }
          return { ...log, changes: redactedChanges };
        });

        return c.json({ data: redactedLogs }, 200);
      } else {
        if (actorId) conditions.push(eq(securityAuditLogs.userId, actorId));

        // Use leftJoin instead of db.query.findMany with 'with'
        const logs = await db
          .select({
            id: securityAuditLogs.id,
            userId: securityAuditLogs.userId,
            event: securityAuditLogs.event,
            ipHash: securityAuditLogs.ipHash,
            userAgent: securityAuditLogs.userAgent,
            metadata: securityAuditLogs.metadata,
            createdAt: securityAuditLogs.createdAt,
            userUsername: users.usernameDisplay,
            userEmail: users.emailDisplay,
          })
          .from(securityAuditLogs)
          .leftJoin(users, eq(securityAuditLogs.userId, users.id))
          .where(and(...conditions))
          .orderBy(desc(securityAuditLogs.createdAt))
          .limit(limit);

        return c.json({ data: logs }, 200);
      }
    },
  );

export default routes;
