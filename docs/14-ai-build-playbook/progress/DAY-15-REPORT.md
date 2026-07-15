# Day 15 Report: Bangun Aplikasi Auth dan Selesaikan Auth Gate

**Status:** `PASSED` **Tanggal:** 13 Juli 2026

## Ringkasan Eksekutif

Seluruh _frontend_ untuk area otentikasi (`apps/auth`) berhasil dibangun dalam waktu cepat. Frontend
kini menggunakan `hono/client` (RPC) untuk integrasi 100% _type-safe_ bersama Hono API (`apps/api`).
Form dilengkapi validasi Zod _client-side_ ganda (mirip dengan server-side) dan notifikasi
`Gooey-Toast` kustom yang ramah _accessibility_.

Fitur utamanya meliputi: _Login_, _Signup_, _Forgot Password_, _Reset Password_, _Email
Verification_, dan _Account Activation_, serta pengarahan param `return_to`.

## File Utama Berubah

### `apps/api/src/app.ts` (MODIFIED)

- Menambahkan ekspor `export type AppType = typeof routes` agar `hono/client` dapat mengurai
  (_infer_) seluruh kontrak API secara otomatis dari Backend ke Frontend.

### `apps/auth/src/lib/api.ts` & `schemas.ts` (NEW)

- Membangun `apiClient` berbekal ekspor `AppType`. Mengatur agar `credentials: 'include'` dikirim
  pada setiap permintaan (_fetch override_) demi berjalannya mekanisme Cookie & CSRF.
- Mengekspor Zod Schemas (_client validation_) yang sejajar dengan batasan/kontrak backend.

### `apps/auth/src/components/ui/` (NEW)

- **`Input.tsx`**: Komponen Input reaktif (_accessible_) dan terpadu untuk pesan error Zod. Pada
  tipe 'password', dibekali opsi `show/hide` visibilitas password menggunakan SVG Icon interaktif.
- **`ToastProvider.tsx`**: Modul _React Context_ dan komponen UI untuk menyajikan notifikasi
  (Success/Error/Info) yang ringan, beranimasi, otomatis pudar dalam 3 detik, dan memiliki standar
  ARIA (`aria-live="polite"`).

### `apps/auth/src/features/*/` (NEW)

- **`LoginPage.tsx`**: Membaca parameter `return_to` dari URL. Setelah login berhasil, pengguna
  dilempar kembali (redirect) ke `return_to` terkait atau halaman `Dashboard`.
- **`SignupPage.tsx`**: Registrasi dengan validasi strict.
- **`ForgotPasswordPage.tsx` & `ResetPasswordPage.tsx`**: Halaman pemulihan akun yang mampu
  meneruskan `token` parameter.
- **`ActivationPage.tsx` & `VerifyEmailPage.tsx`**: Flow _Activation_ (set password dan username)
  bagi pengguna _Guest_, serta UI umpan balik (success/loading/error) verifikasi.

### `apps/auth/src/App.tsx` (MODIFIED)

- Mendefinisikan seluruh map perutean (`react-router-dom`) ke halaman-halaman fungsional auth di
  atas. Dilindungi dengan `ToastProvider` dan `ErrorBoundary`.

## Migration / Env Changes

- Tidak ada. Mengandalkan `VITE_API_URL` dan konfigurasi environment lama.

## Test/Build Commands dan Hasil Nyata

1. **Deno Auth Build:** `deno task --cwd apps/auth build`
   - `✓ 131 modules transformed. built in 1.24s.` (Sukses tanpa pesan error TS/Vite)
2. **Deno API & Root Test:** `deno test --env -A`
   - `ok | 22 passed (22 steps) | 0 failed (6s)` (Perubahan eksport API sama sekali tidak memutus
     unit/integration testing Hono).

## Security Review

- **Credentials Include**: Konfigurasi `fetch` klien dijamin melampirkan `HttpOnly Cookie`.
- **Type Safety**: Pemakaian Hono RPC mencegah _typo_ pada URL maupun JSON payloads dan mencegah
  kebocoran _injection_ dari klien sejak waktu kompilasi.
- **No Secrets di Frontend**: Kode `App.tsx` dan modul Auth _Frontend_ murni UI. Tidak ada akses
  langsung ke database (`drizzle`) maupun _library crypto/oslo_.

## Blocker yang Belum Selesai

Tidak ada.

## Hand-off Day 16

Gate Auth (Frontend + Backend) telah terselesaikan dengan sempurna! Handoff untuk Day 16 adalah
beralih menuju Domain Katalog Produk (Public Catalog API): memfasilitasi daftar/detail produk,
kategori, dan fungsionalitas pencarian untuk Storefront publik.
