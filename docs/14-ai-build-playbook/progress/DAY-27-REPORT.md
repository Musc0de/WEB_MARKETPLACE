# DAY 27 REPORT: Cart Merge, Revalidation, Voucher, & Save-For-Later

## 1. Ringkasan
Implementasi fitur utama e-commerce pada fase *Checkout Preparation* telah berhasil diselesaikan. Fokus utama pada hari ini mencakup transisi keranjang belanja dari guest ke user saat *login* (Cart Merge), validasi ulang harga dan ketersediaan stok (Revalidation), fitur Simpan Untuk Nanti (Save-for-Later), dan pembangunan sistem dasar pemrosesan voucher belanja (Voucher Rule Engine).

## 2. File Berubah Utama
- **`packages/contracts/src/cart.ts`**: Penambahan skema transaksi `MergeCartRequestSchema` dan dukungan `saveForLater`.
- **`packages/contracts/src/vouchers.ts`** (NEW): Penambahan skema request/response validasi voucher.
- **`apps/api/src/modules/cart/cart.ts`**:
  - `POST /merge`: Menggabungkan *guest cart* ke *account cart* secara idempotently, menjumlahkan kuantitas produk namun memastikan tidak melebihi stok yang tersedia (`clamp stock`).
  - `GET /`: Sekarang melakukan *real-time revalidation*, memeriksa apakah produk `inactive` (dan langsung dibersihkan), apakah kuantitas melebihi batas (otomatis *adjusted*), dan melacak perubahan harga (*price changed*). `saveForLater` difilter dari kalkulasi `subtotal`.
- **`apps/api/src/modules/vouchers/vouchers.ts`** (NEW): Endpoint `POST /validate` dengan *rule engine* memeriksa batas tanggal (validFrom/validTo), pembatasan klaim kuota (maxUses), serta tipe diskon integer (IDR).
- **`apps/api/src/app.ts`**: Registrasi *vouchersRouter*.
- **`apps/api/src/modules/cart/cart-merge.test.ts`** & **`apps/api/src/modules/vouchers/vouchers.test.ts`**: Pembuatan unit test/integration test.

## 3. Migration / Env Changes
- Tabel `sss_vouchers` dan `sss_voucher_redemptions` telah ada berdasarkan inisiasi `schema/payments.ts` sebelumnya. Tidak ada perubahan DDL baru atau migrasi database yang diwajibkan untuk fungsi hari ini.
- Tidak ada tambahan environment variables.

## 4. Test/Build Commands
| Command | Hasil | Keterangan |
|---------|-------|------------|
| `deno task check:types` | **PASS** | Sistem terbukti *strongly typed*. Seluruh error TS pada parameter Drizzle dan `app.ts` berhasil dipulihkan. |
| `deno task test` | **PASS** | Semua test `cart-merge.test.ts` dan `vouchers.test.ts` berhasil melewati assertion real-database secara persisten dan isolated. |

## 5. Security Review & Acceptance Evidence
- **Idempotent cart merge**: Merging 2 kali tidak akan menggandakan total item karena pemeriksaan batas *existing variants*. Jika sudah ada, ia dijumlahkan lalu di-clamp (dipotong pada batas max `availableStock`).
- **Real-time revalidation**: Jika harga Drizzle `variant.price` tidak sinkron dengan `item.priceObservation`, maka status `price_changed` terpicu untuk *warning* ke frontend.
- **Voucher validation**: Pemrosesan *strict*. `Voucher.code` wajib terdaftar aktif di DB, dan batas tanggal/kuota selalu dijaga pada sisi server (bukan dipercaya dari *client*).

## 6. Blocker & Technical Debt
- **Aplikasi Voucher ke Checkout**: Saat ini voucher bersifat *stateless validation* dan belum direkam permanen di level cart. Aplikasi akhir (Redemption) akan dilanjutkan di flow Checkout.
- **Merge Lifecycle Hook**: Eksekusi `POST /vouchers/merge` perlu dipanggil langsung dari layer Next.js (Zustand/SWR) begitu proses *Login Auth* mendeteksi ketersediaan local `X-Cart-Token`.

## 7. Handoff Day 28
- **DAY 28** siap melanjutkan pembangunan alur *Checkout Preparation*, mencakup *Delivery Options* (Shipping), Pajak, dan finalisasi validasi kuota voucher sesaat sebelum menjadikannya status pesanan *Pending/Unpaid*.
