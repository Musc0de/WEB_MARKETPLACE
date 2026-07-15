# Day 14 Report: Password Recovery, Activation, and Safe Return_to

**Status:** `PASSED` **Tanggal:** 13 Juli 2026

## Ringkasan Eksekutif

Implementasi aliran utama otentikasi tahap akhir (Pemulihan Kata Sandi & Aktivasi Akun Tertunda)
telah diselesaikan dengan integrasi mitigasi kerentanan keamanan level OWASP.

Fitur utamanya meliputi: perlindungan enumerasi email pada _Forgot Password_, pencegahan serangan
_Open Redirect_ dengan parser URL aman (`return-to`), serta logika pembatalan sesi (_Session
Revocation_) otomatis usai _password reset_ agar penyusup dapat ditendang keluar dari semua
perangkat korban.

## File Utama Berubah

### `packages/auth/src/return-to.ts` (BARU)

- Ekspor `getSafeReturnTo()` untuk mendeteksi _Relative path_ dan _Protocol-relative path_ palsu
  (e.g. `//evil.com`).
- Penapisan berdasarkan array `ALLOWED_HOSTS` untuk memitigasi kerentanan pengalihan URL yang
  dimanipulasi (_Open Redirect Vulnerability_).

### `apps/api/src/modules/auth/recovery.ts` (BARU)

- **`POST /forgot-password`**: Menggunakan respons pesan tunggal (generik) baik email ditemukan
  maupun tidak, lalu menulis pesan `outboxEvents` tipe `password_reset_requested` secara aman dalam
  satu Transaksi Drizzle.
- **`POST /reset-password`**: Memvalidasi token, mengeksekusi `hashPassword()` baru, mencegah
  injeksi token bekas, serta memanggil perintah `update(sessions).set({ revokedAt: now })` untuk
  mende-otorisasi sesi aktif lainnya.

### `apps/api/src/modules/auth/activation.ts` (BARU)

- **`POST /activation`**: Menerima akun yang sebelumnya memiliki `status = pending_verification` dan
  mengaktifkannya jika token sesuai. Akun juga dapat mengatur/mengubah _username_ mereka pada
  langkah ini.

### Tes Integrasi (BARU)

- `apps/api/tests/recovery.test.ts`
- `apps/api/tests/activation.test.ts`

## Migration / Env Changes

- Tidak ada. Seluruh tabel DB yang diperlukan (`outboxEvents`, `tokens`, `users`,
  `passwordCredentials`) telah dibangun di Hari 12/13.

## Test/Build Commands dan Hasil Nyata

1. **Deno Auth Packages Test:** `deno test -A` (CWD: `packages/auth`)
   - `ok | 9 passed | 0 failed (128ms)`
2. **Deno API Test:** `deno task test` (CWD: `apps/api`)
   - `ok | 10 passed (22 steps) | 0 failed (6s)`

## Security Review

- **Anti-Enumeration**: Serangan bot untuk menebak email yang valid pada laman "Lupa Password"
  dicegah dengan respons sukses palsu (status 200).
- **Session Splitting Protection**: Setelah "Reset Password", sesi lama otomatis hancur.
- **Anti-Open Redirect**: Validasi host secara tegas pada mekanisme Return_to URL.

## Blocker yang Belum Selesai

Tidak ada.

## Hand-off Day 15

Sistem Autentikasi kini sangat lengkap di sisi _Backend_. Hand-off untuk Day 15 idealnya mulai
menghubungkan fungsionalitas UI Hono/React, menangani sistem perizinan otorisasi lanjutan
(Role-Based Access Control/RBAC), atau membangun _Background Worker_ untuk menyebar `outboxEvents`
ke _provider_ email (_SendGrid/Resend_).
