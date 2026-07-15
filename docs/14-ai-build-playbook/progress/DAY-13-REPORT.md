# Day 13 Report: Login, Logout, and Session Management

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

## Ringkasan Pekerjaan Hari Ini

Hari ini kita fokus pada perancangan state dan manajemen sesi. Endpoint `login` dan `logout` telah
diselesaikan dengan dukungan Cookie HttpOnly yang aman, dan hashing Token Session menggunakan
SHA-256 via Web Crypto API.

## Detail Implementasi

1. **Sesi Keamanan (`@starsuperscare/auth-pkg`)**:
   - Dibuat utilitas `sessions.ts` yang mengabstraksi fungsionalitas pembuatan `Session Token`.
   - Modul ini mengkalkulasi fungsi `crypto.subtle.digest('SHA-256', token)` dan menyimpannya di
     database, sehingga database hanya menyimpan hash yang tidak dapat di-_reverse_ (anti Session
     Hijacking dari Database Leaks).

2. **Middleware Otentikasi (`apps/api/src/middleware/auth.ts`)**:
   - Dibuat `authMiddleware` di server Hono untuk mengamankan seluruh rute terlindungi.
   - Mengambil token dari header HTTP `Authorization: Bearer` atau cookie HttpOnly `sss_session`.
   - Memastikan sesi belum ditarik (`revokedAt = null`) dan durasinya belum habis.
   - Memastikan pengguna terkait tidak tersuspend atau terbanned.
   - Menginjeksi informasi `session` dan `user` secara _type-safe_ ke `Context` Hono.

3. **API Login (`apps/api/src/modules/auth/login.ts`)**:
   - Menerima `identifier` (Username/Email) dan password.
   - Memverifikasi kata sandi dengan Argon2id.
   - Merekam setiap sukses/gagal di `loginAttempts` demi fitur rate limiting kelak.
   - Menginisiasi sesi berumur `30 hari`.
   - Mengembalikan Cookie HttpOnly secara otomatis.

4. **API Logout (`apps/api/src/modules/auth/logout.ts`)**:
   - Mewajibkan akses otentikasi melalui `authMiddleware`.
   - Menulis `revokedAt` di tabel `sessions`.
   - Menghapus Cookie via header `Set-Cookie`.

5. **Pengujian Integrasi**:
   - _Test Cases_ untuk proses Login yang benar dan salah telah dibuat.
   - _Test Cases_ untuk alur Logout dan pembuktian Middleware untuk akses _unauthorized_ berjalan
     mulus.
   - Modul `login` dan `logout` lolos _Type-checking_ dan berjalan 100% mulus.

## Tantangan & Solusi

- **Drizzle Typed Relations Error**: Saat mengambil `db.query.sessions.findFirst()`, Drizzle
  mengeluhkan ketiadaan schema relations relasional (Error:
  `Cannot read properties of undefined (reading 'referencedTable')`).
- **Solusi**: Diganti menggunakan implementasi **Drizzle Core Query (Manual Query Builders /
  `leftJoin`)**, alih-alih API relasional, yang menjamin kueri valid murni selevel SQL dan dapat
  mencegah _runtime error_ Drizzle.

## Langkah Berikutnya

Melanjutkan pengembangan Sistem Pemulihan Akun (Reset Kata Sandi) di API, atau mulai merancang
infrastruktur Role-Based Access Control (RBAC).
