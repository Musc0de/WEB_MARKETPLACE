# Database Package — Neon PostgreSQL

## Isi package

```text
src/client.ts
src/schema/
src/queries/
src/transactions/
migrations/
seeds/
drizzle.config.ts
```

## Connection

- `DATABASE_URL`: pooled runtime connection.
- `DATABASE_URL_DIRECT`: direct/unpooled untuk migration dan operasi administratif.
- Frontend tidak pernah menerima kedua variable ini.

## Conventions

- Table/column `snake_case`.
- Timestamp `timestamptz` UTC.
- Money `bigint` integer rupiah.
- Soft delete hanya saat benar-benar dibutuhkan.
- Foreign key dan unique constraints menjadi guard terakhir.
- Index ditentukan dari query nyata, bukan semua kolom.
