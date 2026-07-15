# Day 17: Admin RBAC & Catalog CRUD

## Ringkasan

Hari ini, fokus utama adalah mengimplementasikan arsitektur keamanan _Role-Based Access Control_
(RBAC) pada tingkat endpoint serta membuat API Admin untuk mengelola Catalog (Categories, Brands,
Products, dan Variants). Operasi krusial ini dilengkapi dengan _audit trail_ komprehensif, kebijakan
_soft-delete_, dan _optimistic concurrency control_ menggunakan versi.

## Perubahan File Utama

1. **`packages/database/src/schema/catalog.ts`**: Menambahkan kolom `version` dan `deletedAt` pada
   entitas katalog.
2. **`packages/database/src/seeds/rbac-seed.ts`**: Script seeder untuk permission RBAC granular
   (`catalog.read`, `catalog.write`, `catalog.publish`, dsb.) dan Role Admin.
3. **`apps/api/src/middleware/auth.ts`**: Implementasi middleware `requirePermission` yang secara
   dinamis melakukan join ke tabel RBAC di database (menghubungkan User -> Roles -> Permissions).
4. **`apps/api/src/utils/audit.ts`**: Utilitas untuk merekam log jejak sistem (_systemAuditLogs_).
5. **`packages/contracts/src/admin-catalog.ts`**: Zod schema untuk kontrak payload API Admin.
6. **`apps/api/src/modules/admin/catalog/*.ts`**: Endpoint CRUD API untuk kategori, brand, dan
   produk beserta fungsionalitas publish/unpublish yang aman.
7. **`apps/api/tests/admin-rbac.test.ts`**: Testing lengkap matriks otorisasi dan penolakan
   _default-deny_.

## Keputusan Arsitektur

- **Optimistic Concurrency**: Menggunakan integer `version` alih-alih mengandalkan manipulasi
  Timestamp yang berpotensi _flakey_. Setiap operasi update harus mengirim kembali `version` dan API
  akan melakukan inkremen. Jika mismatch, transaksi ditolak dengan `409 Conflict`.
- **RBAC Check via Middleware**: Role/Permission dari user diverifikasi pada saat autentikasi
  (_authMiddleware_) untuk menyimpan array string nama permission langsung di dalam Context Hono,
  sehingga menghindari query N+1 pada pengecekan spesifik.
- **Audit Trails**: Sistem audit _systemAuditLogs_ mengambil _payload_ dan _response_ secara generik
  di dalam blok Drizzle transaction.

## Perubahan Database / Environment

- **Migrations**: `drizzle-kit generate` dan dieksekusi. Tabel katalog memiliki ekstensi skema.
- **Seeds**: `rbac-seed.ts` dibuat untuk menjamin data permission sudah tersedia sebelum testing
  atau penggunaan di lingkungan development.

## Hasil Eksekusi Command

- `deno task generate` : **PASS** (Membuat skema baru).
- `deno task migrate` : **PASS** (Mengaplikasikan ekstensi database).
- `deno run --env -A src/seeds/rbac-seed.ts` : **PASS** (Berhasil melakukan _seeding_ role dan
  permissions).
- `deno test --env -A apps/api/tests/admin-rbac.test.ts` : **PASS** (Seluruh matrix RBAC lolos -
  unauthenticated dan unprivileged ditolak).
- `deno task quality` : **PASS** (Formatting, type-checking, dan linting semua _green_).

## Evidence of Acceptance

- Pengujian test _default deny_ memastikan customer (role customer biasa) mendapatkan 403.
- Skema produk publish dijamin harus memiliki minimal sebuah _variant_ dengan validitas data harga
  dan SKU.

## Blocker / Masalah Tertunda

- Tidak ada. Sistem izin ini berjalan sesuai harapan.
- _Technical Debt_: Ke depannya jika jumlah user dan role membengkak besar (ribuan concurrent
  calls), _caching permissions_ (menggunakan Redis) di lapisan `authMiddleware` perlu
  diprioritaskan.

## Handoff untuk Day 18

Sistem Admin RBAC sudah _production-ready_. API manajemen Katalog (CRUD) dapat digunakan untuk
mengisi data produk ke dalam sistem. Silakan lanjutkan fase Admin atau Katalog Frontend untuk hari
berikutnya dengan integrasi RPC Hono API dari router Admin Catalog!
