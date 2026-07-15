# Backup and Restore Runbook (Neon Postgres)

## Overview
This platform utilizes **Neon Serverless Postgres** which provides native, continuous branching and Point-in-Time Recovery (PITR).

## 1. Point-in-Time Recovery (PITR)
If a catastrophic data mutation occurs (e.g., an accidental `DELETE` without a `WHERE` clause):
1. **Identify Timestamp:** Determine the exact time immediately *before* the incident.
2. **Restore via Neon Console:**
   - Go to your Neon Project -> **Branches**.
   - Select `Restore branch` or `Create branch from time`.
   - Specify the exact date/time down to the second.
3. **Verify Data:** Connect to the newly restored branch using `psql` or DBeaver to confirm the data is intact.
4. **Promote Branch:** Update the `DATABASE_URL` in your production environment (Deno Deploy) to point to the new branch endpoint, effectively making it the new primary.

## 2. Manual Logical Backups
For off-site compliance, manual backups can be taken using `pg_dump`.

### Creating a Backup
```bash
pg_dump "$DATABASE_URL" -F c -f backup_$(date +%F).dump
```

### Restoring a Backup
```bash
pg_restore -d "$DATABASE_URL" -1 backup_YYYY-MM-DD.dump
```

## 3. Drizzle Migration Rollbacks
If a schema migration introduces instability:
- Drizzle does not support automatic `down` migrations.
- To rollback, you must create a *new* migration that reverses the changes (e.g., dropping the new column) and apply it forward.
- **Alternative:** Use Neon's branching to instantly revert the schema and data simultaneously to the pre-migration state.
