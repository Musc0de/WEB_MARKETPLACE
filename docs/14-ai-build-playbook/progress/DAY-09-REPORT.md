# Day 09 Report - Implement Cart, Order, Payment, and Digital Schema

## Phase: Neon dan schema

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

### 1. Ringkasan Modul Baru & Modifikasi

- **Cart (`cart.ts`)**: Terpisah dari modul commerce, kini mencakup tabel `carts` dengan
  `uniqueIndex` spesifik untuk _active cart_ per user, dan `cartItems` dengan dukungan harga
  _snapshot observation_ serta _save for later_.
- **Orders (`orders.ts`)**: Pencatatan order yang direstrukturisasi menjadi _immutable snapshot_.
  Memiliki field `idempotencyKey` pada tabel utama order dan _breakdown_ diskon serta pajak secara
  terperinci.
- **Payments & Fulfillment (`payments.ts`)**: Penambahan tabel riwayat callback dari Payment
  Provider (`paymentEvents`). Menambahkan pelacakan logistik via `shipments` dan `shipmentEvents`.
  Menyertakan _marketing model_ seperti `vouchers` dan riwayat _redemptions_.
- **Digital Entitlements (`digital.ts`)**: Memisahkan aset digital dari katalog produk biasa dan
  menambahkan tabel _entitlements_ pembatasan unduhan yang terkait ke setiap user / order item.

### 2. File Berubah Utama

- `packages/database/src/schema/commerce.ts` (DELETED)
- `packages/database/src/schema/cart.ts` (NEW)
- `packages/database/src/schema/orders.ts` (NEW)
- `packages/database/src/schema/payments.ts` (NEW)
- `packages/database/src/schema/digital.ts` (NEW)
- `packages/database/src/schema/catalog.ts`
- `packages/database/src/schema/index.ts`
- `packages/database/tests/schema.test.ts`
- `packages/database/src/seeds/seed.ts`

### 3. Migration & Environment

- **Migration `0000_furry_betty_brant.sql`** dibuat (fresh migration karena folder migrasi dan DB
  kembali direset akibat refaktor non-interaktif). Terdapat 47 tabel secara keseluruhan.

### 4. Command Verification

```bash
# 1. Database Reset
$ deno run -A src/reset.ts
Dropping public schema...
Creating public schema...
DB reset.

# 2. Database Generate
$ deno task --cwd packages/database generate
[✓] Your SQL migration file ➜ migrations\0000_furry_betty_brant.sql 🚀

# 3. Database Migrate
$ deno task --cwd packages/database migrate
Running migrations...
Migrations completed successfully.

# 4. Database Tests
$ deno task --cwd packages/database test:db
running 2 tests from ./tests/schema.test.ts
Schema Integrity Test ... ok (425µs)
Security Check: Password Hash ... ok (585µs)
ok | 2 passed | 0 failed (6ms)

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

- **Dependencies Circular References**: Dalam Drizzle, pemisahan banyak modul seringkali memicu
  error _module not found / circular import_ apabila _export_ atau _import_ tidak dideklarasikan
  berurutan secara hati-hati. Ini telah diatasi dengan memastikan tipe import Drizzle diatur secara
  eksplisit.
- Semua tabel e-commerce fundamental kini rampung.

### 6. Handoff Day 10

- Skema transaksi (_Checkout, Payments, Entitlements_) kini solid. Tahap selanjutnya adalah
  menyiapkan layer _Backend Service_ (Worker / API) yang berfokus ke operasi bisnis pada skema-skema
  baru ini.
