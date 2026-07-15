# Day 29 Report: Checkout & Order Creation
**Date**: 13 Juli 2026

## 1. Scope Selesai
Hari ini saya telah menyelesaikan pembuatan alur **Checkout** secara komprehensif, mulai dari input alamat, pemilihan kurir pengiriman (Shipping Options), review tagihan (keranjang, subtotal, diskon, ongkir), hingga pencatatan Order beserta preservasi stock barang.

Pekerjaan yang telah diselesaikan mencakup:

### 1. Backend (API)
- **Contracts (`packages/contracts/src/checkout.ts`)**: Mendifinisikan schema validasi untuk formulir Checkout (`Address`, `ShippingOption`, `CheckoutValidate`, `CreateOrder`).
- **Endpoint Validasi (`POST /v1/checkout/validate`)**:
  - Mengecek isi keranjang (cart) aktif dari pengunjung maupun user terdaftar.
  - Memvalidasi ketersediaan stok produk `inventoryLevels.available` secara real-time.
  - Menghitung kalkulasi *Subtotal*, *Voucher* (mocking "STAR10", "HEMAT50"), *Ongkos Kirim*, dan mengembalikan *Grand Total*.
- **Endpoint Order & Reservation (`POST /v1/checkout/orders`)**:
  - Validasi Idempotency menggunakan `idempotencyKey` untuk mencegah duplikasi Order jika di-klik berulang (duplicate submit/retry).
  - Melakukan *reservation* stok secara optimistik menggunakan Drizzle transaction (`inventoryLevels.available - quantity`).
  - Menyimpan data Snapshot Harga, SKU, dan Nama Produk ke tabel `sss_order_items`. Hal ini diperlukan agar riwayat transaksi tidak terpengaruh jika harga barang di Master Catalog kelak diubah.
  - Menyimpan data Alamat dan Tagihan ke tabel `sss_order_addresses`.
  - Menghapus item dari keranjang (CartItem) segera setelah order sukses.

### 2. Frontend (Storefront UI)
- **State Machine Checkout (`CheckoutPage.tsx`)**:
  - Flow 3 Step: Alamat -> Pengiriman -> Pembayaran.
  - Menyediakan tampilan navigasi *Progress Bar* (Step 1, Step 2, Step 3).
- **AddressForm (`AddressForm.tsx`)**: 
  - Validasi *client-side* untuk form (Email, Nama, No. HP, Kota, Kode Pos).
- **ShippingOptions (`ShippingOptions.tsx`)**:
  - Terintegrasi dengan Mock Adapter `POST /v1/checkout/shipping-options` (Pengiriman Standar & Express).
- **Review Summary (Review Pesanan)**:
  - Ringkasan tagihan yang menyesuaikan secara otomatis berdasarkan lokasi dan kurir yang dipilih, terhubung dengan `useCheckoutValidation()`.

## 2. Cara Pengujian (Manual Verification)
Anda dapat memvalidasi fungsionalitas ini dengan langkah berikut:
1. Akses halaman Storefront (`http://localhost:5173`).
2. Masukkan beberapa barang ke keranjang melalui halaman produk.
3. Buka halaman Keranjang (Cart) `/cart`, dan klik tombol **Beli Sekarang**.
4. Anda akan diarahkan ke halaman `/checkout`.
5. Isi formulir **Alamat Lengkap** dan **Email** dengan benar. Klik Lanjutkan.
6. Pilih salah satu **Opsi Pengiriman** (misal: "Express"). Perhatikan *Order Summary* di sidebar akan langsung memperbarui kalkulasi Ongkos Kirim dan Total Akhir. Klik Lanjutkan.
7. Pada halaman **Review Pesanan**, klik **Bayar Sekarang**.
8. Notifikasi `toast` hijau "Pesanan berhasil dibuat!" akan muncul. Keranjang akan kosong, dan stok inventory produk terkait akan otomatis berkurang (bisa dicek melalui Database Studio atau Dashboard Admin nantinya).

Seluruh sistem telah terhubung dengan aman. Silakan periksa di sisi Storefront. Jika UI sudah berjalan dengan baik sesuai harapan, sampaikan instruksi Anda untuk berpindah ke **DAY 30** (Integrasi Payment Gateway).
