import { systemAuditLogs } from '@starsuperscare/database';

export async function logAudit(
  dbOrTx: any,
  params: {
    actorId: string | null;
    entityType: string;
    entityId: string;
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
    changes: { before?: any; after?: any };
  },
) {
  await dbOrTx.insert(systemAuditLogs).values({
    actorId: params.actorId,
    entityType: params.entityType,
    entityId: params.entityId,
    action: params.action,
    changes: params.changes,
  });
}
