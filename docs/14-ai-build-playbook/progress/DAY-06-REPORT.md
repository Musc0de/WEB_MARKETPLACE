# Day 06 Report - Hubungkan Neon, Drizzle, dan migration tooling

## Phase: Neon dan schema

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

### 1. Konfigurasi Lingkungan (Environment Matrix)

- File `.env` kini memuat koneksi Neon PostgreSQL secara riil (tanpa mock).
- `DATABASE_URL`: Menggunakan endpoint `pooler` untuk runtime aplikasi.
- `DATABASE_URL_DIRECT`: Menggunakan endpoint langsung untuk migrasi Drizzle (menghilangkan akhiran
  `-pooler`).
- **Secret Hygiene**: `.env` tidak pernah di-commit ke Git. Aplikasi frontend terisolasi secara
  workspace dan tidak memiliki akses ke nilai ini.

### 2. Implementasi Modul Database

- `src/db.ts`: Drizzle client via `@neondatabase/serverless` dengan dialek Postgres siap digunakan.
- `src/transaction.ts`: Fungsi `withTransaction` dibuat agar operasi database terjamin atomic. Untuk
  environment berbasis serverless HTTP yang belum mendukung stateful transactions secara penuh
  (tanpa WebSocket pool), helper ini memberikan batasan abstraksi yang bersih atau _fallback_
  warning.
- `src/helpers.ts`:
  - `getUtcTimestamp()`: Menggunakan standar ISO 8601 string berbasis UTC.
  - `toIdrInteger()` dan `formatIdr()`: Helper standar untuk menjembatani kalkulasi Rupiah integer
    di database dengan tampilan UI `id-ID`.

### 3. Eksekusi Command & Smoke Test

- Skrip uji koneksi `scripts/db-smoke.ts` menggunakan URL pooler dieksekusi dengan
  `deno task db:smoke`.
- **Hasil DB Smoke Test**: `✅ Connection Successful! DB Version: PostgreSQL 18.4...`
- Drizzle schema generation dan SQL migration sukses dengan command:
  - `deno task db:generate`
  - `deno task db:migrate` -> `Migrations completed successfully.`

### 4. Quality Checks

Semua _check_ dan batasan arsitektur (frontend tidak boleh mengimpor server secrets) tetap hijau:

- `deno task check` (lulus tanpa `ts-ignore` bermasalah)
- `deno lint` (bersih)
- `deno fmt` (terformat dengan standar Deno).

### Security Review

- Kredensial tidak di-hardcode ke file manapun di dalam _version control_.
- Semua tipe moneter sekarang dijaga keakuratannya menggunakan tipe data `integer/bigint` dan
  dikalkulasi secara integer (tanpa pembulatan pecahan _floating-point_ di level DB).

### Hand-off Day 07

Fondasi database Neon sudah 100% online di _cloud_ dan tersinkronisasi. Fase berikutnya (Day 07)
dapat langsung melompat pada arsitektur API atau interaksi _worker_, karena model database telah
lengkap.
