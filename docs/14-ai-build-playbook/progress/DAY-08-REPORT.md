# Day 08 Report - Implement Catalog, Pricing, Inventory, and Review Schema

## Phase: Neon dan schema

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

### 1. Ringkasan Modul Baru & Modifikasi

- **Catalog & Pricing**: Menambahkan `seoTitle`, `seoDescription` ke tabel kategori dan produk,
  `purchaseLimit` untuk pembatasan pembelian. Dibuat tabel `variantPrices` untuk _pricing history_.
  Constraint non-negatif (`price >= 0` dan `compare_price >= 0`) diterapkan menggunakan fitur
  Drizzle `check`.
- **Inventory Ledger**: Pemisahan area inventori ke `inventory.ts`. Pengubahan nama tabel
  `inventoryLocations` menjadi `warehouses`. Penambahan `version` untuk pencegahan _race conditions_
  (_Optimistic Concurrency Control_). Penambahan tabel `inventoryReservations`.
- **Reviews**: Pemisahan `reviews` dan `productRatingStats` ke `reviews.ts` agar struktur domain
  e-commerce menjadi lebih rapi dan modular.

### 2. File Berubah Utama

- `packages/database/src/schema/catalog.ts`
- `packages/database/src/schema/commerce.ts`
- `packages/database/src/schema/inventory.ts` (NEW)
- `packages/database/src/schema/reviews.ts` (NEW)
- `packages/database/src/schema/index.ts`
- `packages/database/tests/schema.test.ts`
- `packages/database/src/seeds/seed.ts`

### 3. Migration & Environment

- **Migration `0000_peaceful_unicorn.sql`** dibuat secara _fresh_ setelah database di-reset. Total
  41 tabel dibuat, memuat seluruh relasi dan index.
- Tidak ada penambahan variabel environment baru hari ini.

### 4. Command Verification

```bash
# 1. Database Reset
$ deno run -A src/reset.ts
Dropping public schema...
Creating public schema...
DB reset.

# 2. Database Generate
$ deno task --cwd packages/database generate
[✓] Your SQL migration file ➜ migrations\0000_peaceful_unicorn.sql 🚀

# 3. Database Migrate
$ deno task --cwd packages/database migrate
Running migrations...
Migrations completed successfully.

# 4. Database Tests
$ deno task --cwd packages/database test:db
running 2 tests from ./tests/schema.test.ts
Schema Integrity Test ... ok (342µs)
Security Check: Password Hash ... ok (398µs)
ok | 2 passed | 0 failed (8ms)

# 5. Database Seed
$ deno task --cwd packages/database db:seed
🌱 Seeding roles...
✅ Inserted 3 roles.
🌱 Seeding dummy users with password "waras123"...
✅ Inserted test user.
🌱 Seeding catalog data...
🌱 Seeding inventory...
✅ Inserted catalog and inventory.
```

### 5. Blocker & Technical Debt

- **Non-Interactive TTY Prompt**: Drizzle meminta prompt konfirmasi ketika nama tabel diubah (misal
  dari _inventoryLocations_ menjadi _warehouses_). Sebagai _workaround_, direktori `migrations`
  di-reset ulang sejak tahap pengembangan masih tahap awal.
- Tidak ada blocker utama. Semua kebutuhan constraint dan seeder telah tercapai.

### 6. Handoff Day 09

- Skema _Catalog_, _Inventory_, dan _Review_ sudah komprehensif. Hari berikutnya dapat masuk ke
  tahap API Endpoint _backend_ untuk Storefront atau administrasi Catalog.
