# Release Candidate 1 (RC-1)

**Date**: 15 July 2026
**Target Environment**: Staging
**Status**: IN-PROGRESS

## Scope
- Marketplace Storefront
- User Dashboard
- Authentication UI
- System Admin Panel
- Package Tracking
- Core API & Background Workers

## Release Blocking Criteria (UAT)
Semua poin di bawah ini harus tercentang sebelum RC-1 dapat dipromosikan ke Production.

### 1. Functional
- [ ] Pengguna dapat mendaftar, login, dan melakukan reset password.
- [ ] Pengguna dapat mencari, melihat, dan menambahkan produk ke keranjang.
- [ ] Alur Checkout berjalan lancar hingga pembuatan Order.
- [ ] Integrasi webhook Payment dan Shipping Sandbox berjalan dengan baik.
- [ ] Pekerja latar belakang (Worker) berhasil memproses antrean email dan notifikasi.

### 2. Security & Hardening
- [ ] Session Cookies diset ke `secure: true`, `httpOnly: true`, `sameSite: 'Lax'` (berjalan pada HTTPS/Staging).
- [ ] CORS memblokir semua request origin selain dari yang di-allowlist di `staging.env.example`.
- [ ] Secret Keys menggunakan format khusus staging/sandbox (Midtrans, Resend) dan tidak ada hardcoded secret di repository.
- [ ] Tidak ada Endpoint administratif (API `/v1/admin/*`) yang terbuka tanpa Autentikasi dan pengecekan Role `admin`.

### 3. Infrastructure & Deployment
- [ ] GitHub Actions berhasil melakukan _build_, uji tipe (_typecheck_), dan _deploy_.
- [ ] Deno Deploy API dan Frontend (Cloudflare Pages/Vercel/dll) berjalan dan lolos tes ketersediaan (`/health`).
- [ ] Koneksi Database Neon (Staging branch) stabil dan migrasi schema terbaru sukses dieksekusi.

## Notes & Known Issues
_Tuliskan temuan atau defect selama masa UAT di sini._
- (Belum ada catatan)
