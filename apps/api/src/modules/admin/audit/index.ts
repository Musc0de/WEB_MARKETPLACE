import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, desc, eq, gte, lte, SQL } from 'drizzle-orm';
import { db, securityAuditLogs, systemAuditLogs } from '@starsuperscare/database';
import { AuthContext, authMiddleware, requirePermission } from '../../../middleware/auth.ts';

const app = new Hono<AuthContext>();

const FilterSchema = z.object({
  type: z.enum(['system', 'security']).default('system'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  actorId: z.string().uuid().optional(),
});

const routes = app
  .use('*', authMiddleware)
  .get(
    '/',
    requirePermission('settings.read'),
    zValidator('query', FilterSchema),
    async (c) => {
      const { type, startDate, endDate, actorId } = c.req.valid('query');

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

        const logs = await db.query.systemAuditLogs.findMany({
          where: and(...conditions),
          orderBy: [desc(systemAuditLogs.createdAt)],
          limit: 100,
          with: {
            // @ts-ignore:dsadasdsa
            actor: {
              columns: {
                id: true,
                usernameDisplay: true,
                emailDisplay: true,
              },
            },
          },
        });

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

        const logs = await db.query.securityAuditLogs.findMany({
          where: and(...conditions),
          orderBy: [desc(securityAuditLogs.createdAt)],
          limit: 100,
          with: {
            // @ts-ignore:dsadsa
            user: {
              columns: {
                id: true,
                usernameDisplay: true,
                emailDisplay: true,
              },
            },
          },
        });

        // Redact PII in metadata if necessary (e.g. raw tokens)
        const redactedLogs = logs.map((log) => {
          const metadata = log.metadata;
          // Add specific redaction logic if needed
          return { ...log, metadata };
        });

        return c.json({ data: redactedLogs }, 200);
      }
    },
  );

export default routes;
