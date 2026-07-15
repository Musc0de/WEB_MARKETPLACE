# Day 24 Report: Search, Category, Brand, Filters, Sort, dan URL State

## Outcome Hari Ini
- Mengimplementasikan fungsionalitas pencarian dinamis melalui `SearchPage.tsx` yang menangani rute hibrida: `/search`, `/categories/:slug`, `/brands/:slug`, dan `/products`.
- Sinkronisasi URL (_URL as single source of truth_) diimplementasikan dengan `useSearchFilters.ts`, sehingga tautan dapat dibagikan dengan bebas (shareable) dan back/forward history browser terjaga dengan mulus.
- Menambahkan **Tailwind CSS v4** (`@tailwindcss/vite`) yang sebelumnya terlewat di konfigurasi `apps/storefront`, sehingga tampilan *Storefront* dan *Design System* kini merender gaya *Tailwind* secara aktual saat *development mode/production*.

## Revisi Backend (Sesuai Konfirmasi)
- **Schema & API Contract**: Menambahkan dukungan filter `min_rating` (minimum bintang) dan `promo` (barang sedang diskon) di dalam `ProductListQuerySchema` (`packages/contracts/src/catalog.ts`).
- **Database Query**: Mengupdate query builder pada endpoint produk (`apps/api/src/modules/catalog/products.ts`) untuk memfilter berdasarkan rating dan komparasi harga (`comparePrice > price`). Dengan begitu, kita memfilter dari database asli, bukan hanya trik di front-end.

## File Utama yang Berubah
1. `apps/storefront/vite.config.ts` - Ditambahkan TailwindCSS Vite plugin.
2. `apps/storefront/src/index.css` - Di-generate untuk menginjeksi `@import "tailwindcss"` dan mendaftarkan `@source "../../packages/ui"`.
3. `apps/storefront/src/main.tsx` - Mengimport `index.css`.
4. `apps/storefront/src/features/search/SearchPage.tsx` (Dulu `ProductsPage.tsx`) - Merangkum logika grid product, filter debounced, sorting, skeleton, pagination, dan fallback UX (empty state).
5. `apps/storefront/src/features/catalog/filters/CatalogFilters.tsx` & `MobileFilterDrawer.tsx` - Komponen filter UI yang mem-fetch kategori & brand secara dinamis.
6. `apps/storefront/src/App.tsx` - Mendaftarkan ulang rute pencarian agar diarahkan ke `SearchPage.tsx`.

## Pengujian dan Hasil
- **`deno task check:types`**: SUCCESS (Lulus 100% tanpa error tipe setelah semua *contract* disesuaikan).
- **CSS Rendering Test**: Karena sekarang menggunakan `@tailwindcss/vite`, perbaikan UI bisa terlihat (Tailwind kelas-kelas yang disematkan akan terevaluasi menjadi gaya CSS sesungguhnya).

## Handoff Day 25
Aplikasi kini siap dengan fitur etalase/katalog yang tangguh. Pekerjaan selanjutnya (Day 25) akan difokuskan pada manajemen *Cart* (Keranjang Belanja) untuk memfasilitasi Checkout yang aman dan andal.
