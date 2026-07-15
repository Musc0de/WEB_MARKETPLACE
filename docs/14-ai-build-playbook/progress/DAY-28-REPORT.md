# DAY 28 REPORT: Cart UI Lengkap

## 1. Ringkasan
Implementasi fitur antarmuka keranjang belanja (Cart UI) telah berhasil diselesaikan secara utuh menggunakan React, Vite, TailwindCSS, dan Hono RPC (SWR). Pengerjaan hari ini mencakup interaksi real-time dengan backend, fitur state "optimistic mutation", manajemen error dengan `goey-toast`, serta penanganan token tamu (`X-Cart-Token`) di dalam penyimpanan lokal (`localStorage`).

## 2. File Berubah Utama
- **`apps/storefront/src/features/cart/api/useCart.ts`** (NEW): Custom hook React berbasis `swr` yang membungkus endpoint Hono RPC `GET /v1/cart`. Menangani *optimistic rollback* secara mulus untuk operasi `addItem`, `updateItem`, `removeItem`, `clearCart`, dan `applyVoucher`.
- **`apps/storefront/src/features/cart/components/CartItemCard.tsx`** (NEW): UI Item responsif yang menampilkan rincian produk, kuantitas dengan *clamp* limit (terhadap stok), interaksi tambah/kurang item, pindah ke Saved For Later, dan hapus, ditambah pelaporan badge status otomatis (seperti *price_changed*).
- **`apps/storefront/src/features/cart/components/CartSummary.tsx`** (NEW): Modul panel sisi kanan Desktop/Footer Mobile yang menyediakan rincian Subtotal, potongan harga (voucher/total discount), estimasi ongkos kirim sementara, tagihan akhir, serta tombol validasi *Voucher* dan penyelesaian *Checkout*.
- **`apps/storefront/src/features/cart/pages/CartPage.tsx`** (NEW): Komponen hierarki level *Route* dengan transisi state pemuatan (Loading), state kosong (Empty State), error fallback, list pemisahan antara `activeItems` dan `savedItems`, serta tata letak 2 kolom bergaya modern.
- **`apps/storefront/src/lib/api.ts`**: Penyesuaian `hc` Hono Client config agar mendeteksi keberadaan `localStorage.getItem('guestToken')` secara proaktif untuk menginjeksikan header `X-Cart-Token` ke dalam *fetcher* bawaan RPC.
- **`apps/api/src/routes/v1/vouchers.ts`**: Koreksi type export pada instance Hono Router agar RPC `client.v1.vouchers` terdaftar valid di *front-end* tanpa error Typescript.
- **`apps/storefront/src/App.tsx`**: Pemetaan router `<Route path='/cart' element={<CartPage />} />`.

## 3. Migration / Env Changes
- Tidak ada penyesuaian infrastruktur Drizzle atau migrasi database.
- Lingkungan `API_URL` tetap mengambil referensi standar pada `VITE_API_URL` dengan mekanisme *fallback* dev lokal (`http://localhost:8000`).

## 4. Test/Build Commands
| Command | Hasil | Keterangan |
|---------|-------|------------|
| `deno test --env -A apps/storefront/src/features/cart/pages/CartPage.test.tsx` | **PASS** | Rendering dan uji statis dependencies TypeScript dari layer presentasi CartPage berjalan optimal. |
| `deno task build:storefront` | **PASS** | Vite berhasil *bundle* produksi dan *build time* (3.55s). |

## 5. Security Review & Acceptance Evidence
- **Mutasi Optimistik Terjaga**: Perubahan `quantity` di sisi klien (UI) akan diputar kembali (`revert / rollback`) dengan me-reload data dari DB server apabila injeksi backend gagal (contoh, latensi atau database out-of-sync).
- **Cart-Token Integrity**: ID Keranjang Tamu (`guestToken`) diproses dengan *Secure Header Propagation*.
- **Server-Driven Data Validation**: Semua peringatan ketersediaan stok (`out_of_stock`, `price_changed`) dan Total Biaya bukan dihitung mutlak dari JS *Client*, melainkan dimuat ulang berdasarkan konfirmasi Server (Data Source of Truth). Limit kuantitas tidak mungkin melebihi stok, tombol `+` akan *disabled* secara otomatis jika mendekati ambang stok asli `availableStock`.

## 6. Blocker & Technical Debt
- **DOM Integration Testing**: Kerangka kerja Vite/Storefront belum menyertakan `jsdom` dan `@testing-library/react`. Tes untuk *Front-End* sementara difokuskan pada import sanity (seperti Day sebelumnya). Di waktu mendatang (misal Day 40+ untuk QA), Deno dom/playwright akan lebih ideal.
- **Hono Router Typing Caching**: Terkadang kompilasi Typescript `hono/client` tidak segera sinkron jika kita mengubah `apps/api` tanpa me-restart tsserver.

## 7. Handoff Day 29
- **DAY 29** diusulkan untuk melangkah ke modul *Checkout Page* UI: Pemilihan metode pengiriman, input catatan pesanan, validasi ongkir dinamis (Mocked Rate Calculation), penyerapan total Voucher ke transaksi, dan presentasi gateway pembayaran.
