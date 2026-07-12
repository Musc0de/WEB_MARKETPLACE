# Migration, Seed, dan Branch Workflow

## Migration rules

1. Ubah Drizzle schema.
2. Generate migration.
3. Review SQL manual.
4. Jalankan pada Neon development branch.
5. Jalankan integration tests.
6. Terapkan staging.
7. Backup/restore readiness check.
8. Terapkan production sebelum/bersamaan dengan compatible app deploy.

## Backward-compatible deploy

Gunakan expand-and-contract:

1. Tambah kolom/table baru nullable.
2. Deploy app yang menulis format baru dan tetap membaca lama.
3. Backfill.
4. Pindahkan pembacaan sepenuhnya.
5. Tambah constraint/drop lama pada release terpisah.

## Seed

Seed hanya data aman:

- Admin development.
- Category/brand contoh.
- Product dummy.
- Test user/order.

Jangan seed production dengan password default tetap.

## Preview branch

Pull request dapat memakai branch Neon terisolasi. Gunakan schema-only/anonymized data bila
sumbernya production.
