# Neon Setup

## Branch

```text
production
staging
development
preview/{pull-request}
```

Gunakan schema-only atau anonymized branch saat data production sensitif tidak boleh disalin ke development.

## Langkah

1. Buat Neon project di region dekat runtime aplikasi.
2. Buat role aplikasi dengan privilege minimum.
3. Ambil pooled connection string untuk runtime.
4. Ambil direct connection string untuk migration.
5. Simpan secret di environment manager, bukan repository.
6. Aktifkan branch development dan staging.
7. Jalankan migration ke development, test, lalu staging, baru production.

## Driver

- One-shot query dapat memakai Neon HTTP driver.
- Session/interactive transaction memakai WebSocket/serverful driver yang mendukung transaction.
- Untuk blueprint ini, abstraksikan client agar deployment profile dapat dipilih tanpa mengubah domain logic.

## Retry

Transient connection failure harus ditangani dengan retry terbatas untuk operasi yang aman/idempotent. Jangan retry payment side effect tanpa idempotency.
