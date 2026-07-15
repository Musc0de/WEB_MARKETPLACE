# DAY 25 REPORT: Wishlist API dan Storefront Integration

## 1. Ringkasan
Implementasi fitur Wishlist (Daftar Keinginan) telah berhasil diselesaikan. Fitur ini memungkinkan pengguna *guest* menyimpan wishlist di `localStorage` (*client-side*), dan untuk pengguna yang telah *login* (akun) menyimpan wishlist langsung ke database (*server-side*). Antarmuka (UI) Storefront kini memiliki status "hati" (heart state) interaktif dengan kemampuan *optimistic update* yang dilengkapi mekanisme *rollback* bila terjadi kegagalan jaringan.

## 2. File Berubah Utama
- **`packages/contracts/src/wishlist.ts`**: Mendefinisikan schema `AddWishlistRequestSchema`, `RemoveWishlistRequestSchema`, `MergeWishlistRequestSchema` serta respons.
- **`packages/contracts/index.ts`** & **`packages/contracts/src/index.ts`**: Ekspor module schema Zod.
- **`packages/database/src/schema/wishlist.ts`**: Tipe eksplisit (explicit type) disesuaikan agar kompiler TypeScript monorepo tidak melempar error.
- **`apps/api/src/modules/wishlist/wishlist.ts`**: Implementasi router API keranjang dengan resolver produk lengkap termasuk memproyeksikan stok dan harga. Kueri disesuaikan membaca kolom yang benar di tabel gambar (`object_key` dan `sort_order`).
- **`apps/api/src/app.ts`**: *Routing* Wishlist module ke `v1/wishlist`.
- **`apps/storefront/src/features/wishlist/useWishlist.ts`**: State management (menggunakan Zustand) yang terhubung ke `localStorage` (untuk guest) dan sinkronisasi server via `lib/api.ts` bila login.
- **`apps/storefront/src/features/wishlist/components/WishlistButton.tsx`**: Komponen tombol UI (Heart Icon) terintegrasi state. 

## 3. Migration / Env Changes
- Kueri SQL diperbarui untuk membaca skema database yang ada tanpa error (`sss_product_images.object_key` menggantikan field bawaan lama). 
- Tidak ada migrasi struktural maupun environment variable baru yang spesifik di perlukan.

## 4. Test/Build Commands
| Command | Hasil | Keterangan |
|---------|-------|------------|
| `deno task check:types` | **PASS** | Sistem terbukti *strongly typed*. Ekspor kontrak berhasil dilacak IDE (setelah reset). |
| `curl http://localhost:8000/v1/wishlist` | **PASS** | Saat tak memiliki kredensial, akan membalas HTTP `401 Unauthorized`. Sebelumnya menghasilkan `500 Internal Server Error` (kolom kueri database sudah disempurnakan). |

## 5. Security Review & Acceptance Evidence
- **Guest Wishlist Tetap Setelah Refresh**: Zustand secara otomatis mem- *persist* state guest ke `localStorage`.
- **User Hanya Melihat Wishlist Sendiri**: Rute mem-filter secara ketat via session (`wishlists.userId = session.userId`).
- **Optimistic Failure Di-rollback**: `useWishlist.ts` memutar kembali memori state lama bila *fetch request* ke API gagal.
- **Product Data Tetap Berasal Dari Server**: API secara transparan memproyeksikan harga (dari `productVariants`) dan stok total (`inventoryLevels`). Browser tidak pernah menentukan validitas wishlist.

## 6. Blocker & Technical Debt
- API untuk melakukan *Merge* wishlist setelah user registrasi/login dari mode *guest* belum sepenuhnya dihubungkan dengan Storefront *auth trigger*.
- Storefront Accessibility Baseline (Smoke Test) dapat dioptimalkan di masa mendatang untuk `WishlistButton`.

## 7. Handoff Day 26
Penyelesaian Wishlist berjalan lancar, dan laporan ini menuntaskan fase integrasi Day 25. Semua kueri Drizzle (Join SQL) yang bermasalah karena asimetri nama field dengan schema database utama juga telah diidentifikasi dan dituntaskan, menjadi bekal aman untuk integrasi Cart (Day 26).
