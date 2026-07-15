# DAY 16 REPORT: Public Catalog API

## Ringkasan Eksekutif

Implementasi API Katalog Publik untuk Storefront telah berhasil diselesaikan. Kami telah menambahkan
endpoint list produk, detail produk, daftar kategori, dan daftar brand ke dalam API Backend. Kami
mengoptimalkan query list produk menggunakan LEFT JOIN untuk menggabungkan data penjualan, rating,
harga, dan stok yang dikelompokkan berdasarkan `GROUP BY`, menghindari masalah N+1 dalam pencarian
produk.

## File yang Berubah

### Backend & API

- **[NEW]** `packages/contracts/src/catalog.ts`: Schema Zod untuk query parameter dan struktur
  respons.
- **[MODIFIED]** `packages/contracts/index.ts`: Export file `catalog.ts`.
- **[NEW]** `apps/api/src/modules/catalog/categories.ts`: API endpoint untuk list kategori produk.
- **[NEW]** `apps/api/src/modules/catalog/brands.ts`: API endpoint untuk list brand.
- **[NEW]** `apps/api/src/modules/catalog/products.ts`: API endpoint untuk mencari produk (`/`) dan
  melihat detail berdasarkan slug (`/:slug`), lengkap dengan penghitungan _total available stock_
  dan rentang harga (min/max price).
- **[NEW]** `apps/api/src/routes/v1/catalog.ts`: Menggabungkan submodule produk, kategori, dan
  brand.
- **[MODIFIED]** `apps/api/src/app.ts`: Me-mount `catalogRouter` pada route `/v1/catalog`.
- **[MODIFIED]** `deno.jsonc`: Menambahkan scripts `test:api`, `test:catalog`, dan `quality`.

### Tests

- **[NEW]** `apps/api/tests/catalog.test.ts`: Testing integrasi (Integration test) untuk memastikan
  seluruh endpoint catalog bekerja dan mengembalikan format respons yang benar.

## Keputusan Teknis

1. **Query Builder Drizzle untuk Agregasi Produk**: Schema database kita tidak menggunakan fungsi
   `relations()`. Karena itu, query dibentuk menggunakan `db.select()` konvensional beserta
   `leftJoin` eksplisit pada tabel `productVariants`, `inventoryLevels`, `productRatingStats`, dll.,
   lalu diakhiri dengan klausa `groupBy` dan `$dynamic()` untuk memudahkan pemfilteran dinamis tanpa
   menyebab error Type pada TypeScript (berkat re-assignment variabel yang tepat pada Drizzle).
2. **Pengecekan Tipe UUID pada Filter**: Filter untuk `category` dan `brand` pada frontend dapat
   berupa Slug (string biasa) atau ID (UUID). API akan melakukan RegExp matching untuk memeriksa
   apakah parameter tersebut berbentuk UUID dan menyesuaikan filter WHERE secara otomatis.
3. **Penyelesaian Linting**: Kami merapihkan berbagai _warnings_ linting yang ada di project
   (`unused vars`, `prefer-const`, `ts-ignore missing comment`) agar perintah `deno task quality`
   lolos (Pass).

## Command yang Dijalankan

- `deno task test:api` : **PASS** (Menguji seluruh testing API backend).
- `deno task test:catalog` : **PASS** (Menguji `catalog.test.ts` secara khusus).
- `deno task quality` : **PASS** (Memeriksa _formatting_, _linting_, dan _type-checking_ serta
  menjalankan semua _tests_).
- `deno fmt` : Dijalankan untuk mem-format 274 files sebelum testing lanjutan.

## Blocker dan Technical Debt

- Menghitung stok dan total varian secara mentah (live query) di endpoint list berpotensi menurunkan
  kinerja untuk produk dengan data stok masif. _Materialized views_ atau _denormalisasi_ (caching
  total stock ke dalam tabel produk) sebaiknya direncanakan untuk tahap produksi jika trafik
  meningkat.

## Acceptance Evidence

Semua 24 pengujian pada modul backend dan worker telah berhasil 100% tanpa ada kesalahan. Endpoint
list dan endpoint detail menghasilkan respon envelope `data`, `meta`, dan `error` secara konsisten
(menggunakan Zod contracts).

## Handoff ke Day 17

Arsitektur API katalog sudah solid. Frontend storefront siap mengonsumsi endpoint ini menggunakan
Hono RPC client (yang di-generate lewat endpoint `/v1/catalog`). Untuk hari berikutnya, Frontend Web
Marketplace dapat dibangun beserta sistem halamannya.
