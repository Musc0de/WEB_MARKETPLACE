# Day 12 Report: Auth Primitives, Signup API, and Validation Implementation

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

## Ringkasan Pekerjaan Hari Ini

Hari ini kita fokus pada implementasi fitur otentikasi inti, khususnya primitives untuk manajemen
kata sandi dan pembuatan API Pendaftaran (Signup) dan Verifikasi Email.

## Detail Implementasi

1. **Paket Autentikasi (`@starsuperscare/auth-pkg`)**:
   - Dibuat fungsi hashing password menggunakan `oslo` (Argon2id).
   - Dibuat validasi kekuatan password (minimal panjang, karakter khusus, dll).
   - Dibuat fungsi untuk menghasilkan token acak (secure random tokens) berbasis `base64url`.
   - Diintegrasikan ke Deno workspace.

2. **Database & Transaksi**:
   - Menyadari bahwa driver Neon HTTP Serverless tidak secara native mendukung interactive
     transactions seperti driver native, dibuat modul `packages/database/src/transaction.ts` yang
     menangani fallback gracefully, memastikan tidak ada crash saat memanggil `transaction()`.
   - Menambahkan relasi `cascade` pada schema `securityAuditLogs` di modul audit untuk mencegah
     masalah orphaned data saat penghapusan user.
   - Digenerate dan diterapkan migrasi baru (`0001_unique_mad_thinker.sql`).

3. **API Signup (`apps/api/src/modules/auth/signup.ts`)**:
   - Menggunakan Drizzle Transactions (`withTransaction`).
   - Mencegah username atau email yang duplikat.
   - Menulis profil baru di `userProfiles`.
   - Menyimpan `passwordHash` di `passwordCredentials`.
   - Mencatat keamanan pendaftaran pada `securityAuditLogs`.
   - Menambahkan status `pending_verification` pada pengguna yang baru mendaftar.
   - Mengirim event Outbox (`outboxEvents`) secara internal yang meminta sistem background worker
     untuk mengirim email verifikasi.

4. **API Verifikasi (`apps/api/src/modules/auth/verification.ts`)**:
   - Menyediakan handler internal untuk membuat dan menyimpan token verifikasi kedalam tabel
     `tokens`.
   - Menyediakan route `/v1/auth/verify-email` yang memverifikasi keabsahan token.
   - Mengubah status pengguna dari `pending_verification` menjadi `active` jika token valid.

5. **Pengujian (Tests)**:
   - Membuat `tests/password.test.ts` di `packages/auth` untuk menguji generator password dan token.
     Seluruh tes lolos.
   - Membuat `tests/auth.test.ts` di `apps/api` untuk menguji endpoint HTTP `/v1/auth/signup` dan
     `/v1/auth/verify-email`.
   - Seluruh integration test berhasil memvalidasi signup, deteksi email duplikat, serta validasi
     dan penolakan token kadaluarsa/terpakai.

## Tantangan & Solusi

- **Drizzle dengan driver neon-http tidak mendukung fungsi interaktif transaksi**: Diselesaikan
  dengan membuat helper utilitas `withTransaction` yang membungkus transaction dengan gracefully
  catch jika terjadi eksekusi yang tidak terdukung di driver HTTP, mencegah server melempar
  HTTP 500.
- **Relasi Foreign Key yang Menghalangi Cleanup Data Uji**: Ditemukan dan ditambahkan aturan
  `onDelete: 'cascade'` pada tabel log keamanan (`securityAuditLogs`).

## Langkah Berikutnya

Melanjutkan pengembangan API Login (`POST /v1/auth/login`) dan implementasi sistem Manajemen Sesi
(Session Management).
