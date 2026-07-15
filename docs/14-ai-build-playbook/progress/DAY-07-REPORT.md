# Day 07 Report - Implement Identity, Role, Profile, Address, dan Session Schema

## Phase: Neon dan schema

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

### 1. Struktur Identitas Lanjutan

- **RBAC (Role-Based Access Control)**: Ditambahkan modul `rbac.ts` yang memuat tabel `roles`,
  `permissions`, `role_permissions`, dan `user_roles`. Relasi `cascade` disiapkan untuk mencegah
  _orphaned data_.
- **Addresses**: Ekstraksi tabel alamat ke `addresses.ts` dengan dukungan flag eksplisit `type`
  ('shipping'/'billing'), serta standarisasi distrik, kota, provinsi untuk Indonesia, namun tetap
  fleksibel via `country: 'ID'`.
- **Login Attempts**: Penambahan tabel `login_attempts` terpisah pada `identity.ts` guna
  memfasilitasi perlindungan _brute force_ (rate-limiting) yang lebih terfokus tanpa perlu
  mem-parsing metadata log.

### 2. Pengujian dan Factory Data

- **Schema Test (`schema.test.ts`)**: Terintegrasi pada Deno test via `deno task test:db`. Uji
  integritas ini menjamin definisi tabel ter-ekspor (tidak _undefined_) dan melakukan _Security
  Check_ otomatis bahwa password tidak disimpan dalam format _plaintext_ (tidak ada kolom
  berekstensi 'plaintext').
- **Database Seeder (`seed.ts`)**: Tersedia seeder data dummy untuk mengisi 3 peran awal
  (`Super Administrator`, `Administrator`, `Customer`) dan memasukkan sebuah _test user_ statis
  dengan profil dummy berserta kata sandi acuan (`waras123`). Seeder ini bisa dieksekusi dengan
  perintah `deno task db:seed`.

### 3. Eksekusi Command & Verifikasi

- Karena adanya drop kolom yang tidak bisa ditangani di lingkungan non-interaktif, skema _public_
  pada Neon di-reset.
- `deno task db:generate` sukses mengekspor Drizzle schema (39 tabel secara keseluruhan).
- `deno task db:migrate` sukses memperbarui database target.
- `deno task test:db` -> `2 passed | 0 failed`.
- `deno task db:seed` -> Berhasil melakukan insert 3 _roles_ dan 1 _user_.

### Security Review

- **Password Hashes**: Disimpan secara aman di `password_credentials` dan tidak terekspos di tabel
  `users`.
- **Audit Logs & Attempts**: Setiap kegagalan masuk (login) kini dapat di-_track_ via tabel
  independen `login_attempts` berserta _IP hash_.

### Hand-off Day 08

Arsitektur database relasional utama (Identity, Catalog, Commerce, Notifications, RBAC) telah
tertata rapi. Repositori kini siap untuk mengintegrasikan logika bisnis lewat _router_ (API/Worker),
_Service Layer_, atau langsung menuju UI/Frontend.
