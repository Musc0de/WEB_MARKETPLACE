# DAY 26 REPORT: Cart API untuk Guest dan Account

## 1. Ringkasan
Implementasi Cart API (Keranjang Belanja) untuk memfasilitasi operasional belanja bagi pengguna (yang telah login) maupun *guest* (tamu). Fitur ini berfokus pada keamanan tinggi di sisi server di mana *client* tidak memiliki wewenang memodifikasi harga.
- Token *guest* dihasilkan secara acak (UUID) dan dicetak dengan fungsi kriptografi SHA-256 (melalui Native Web Crypto API) sebelum dimasukkan ke database untuk mencegah kompromi data plaintext.
- Penghitungan subtotal, diskon, dan grand total dilakukan 100% pada *server-side*.

## 2. File Berubah Utama
- **`packages/contracts/src/cart.ts`** (NEW): Zod schema dan TypeScript interface untuk operasional Cart.
- **`packages/contracts/index.ts`** & **`src/index.ts`**: Menambahkan export untuk module cart.
- **`apps/api/src/utils/crypto.ts`** (NEW): Utility untuk digest hash (SHA-256) memanfaatkan Web Crypto API.
- **`apps/api/src/modules/cart/cart.ts`** (NEW): Router inti dengan logika operasional keranjang belanja (*transactional endpoints*, resolve identity).
- **`apps/api/src/routes/v1/cart.ts`** (NEW): Ekspor router keranjang belanja.
- **`apps/api/src/app.ts`**: Registrasi route ke `/v1/cart`.
- **`apps/api/src/modules/cart/cart.test.ts`** (NEW): Unit test.

## 3. Migration / Env Changes
- Tidak ada migrasi database yang diperlukan (struktur `sss_carts` dan `sss_cart_items` sudah sesuai).
- Penambahan dua modul baru dari JSR: `@std/encoding` (untuk konversi Hex pada digest) dan `@std/assert` (untuk testing).

## 4. Test/Build Commands
| Command | Hasil | Keterangan |
|---------|-------|------------|
| `deno task check:types` | **PASS** | Sistem terbukti *strongly typed*. |
| `deno test apps/api/src/modules/cart/cart.test.ts` | **PASS** | Testing digest token berjalan sempurna. |

## 5. Security Review & Acceptance Evidence
- **Browser bukan source of truth**: Semua penghitungan harga membaca nilai `drizzle-orm` (table `productVariants` & `products`).
- **Guest token tidak disimpan plaintext**: Menggunakan `crypto.subtle.digest('SHA-256')` sebelum di-record ke `guestTokenHash`.
- **Authorization**: Resolver keranjang memeriksa autentikasi token vs cookie session sebelum membaca DB.

## 6. Blocker & Technical Debt
- *Merge Cart*: Penggabungan *guest cart* ke *account cart* saat user melakukan login belum diimplementasikan di *auth module*.
- Belum ada integrasi endpoint cart di Storefront UI (akan dilanjutkan pada hari berikutnya).

## 7. Handoff Day 27
- **DAY 27** dapat langsung mulai mengintegrasikan UI keranjang (*Cart Drawer / Page*) di Storefront menggunakan Zustand dan sinkronisasi API dari rute yang baru saja selesai dibuat.
