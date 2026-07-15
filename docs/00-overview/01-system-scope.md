# Scope Sistem

## Tujuan MVP

Membangun toko online untuk produk fisik dan digital dengan alur guest checkout, login username/password, pembuatan akun otomatis setelah pembayaran sukses, invoice email, dashboard client, serta admin operasional.

## Model bisnis fase pertama

- Satu operator toko: StarSuperScare.
- Mendukung produk `physical`, `digital`, dan opsional `service`.
- Schema menyediakan `store_id` agar dapat dikembangkan menjadi multi-seller tanpa merombak tabel utama.
- Seller dashboard belum termasuk MVP.

## Aktor

1. Guest: melihat produk, membuat cart, checkout, dan membayar.
2. Client user: login, melihat order, invoice, download digital, mengelola profil, dan membuat tiket.
3. Admin: mengelola produk, stok, pesanan, pembayaran, client, refund, dan notifikasi.
4. System worker: memproses outbox, email, invoice, webhook lanjutan, dan retry.

## Alur utama

```text
Produk -> Cart -> Checkout -> Payment -> Order Paid
                                      -> Invoice Email
                                      -> Akun dibuat/ditautkan
                                      -> Aktivasi password bila guest baru
                                      -> Dashboard order/download
```

## Tidak termasuk MVP

- Marketplace multi-seller penuh.
- Aplikasi mobile native.
- Kafka sebagai kewajiban awal.
- Penyimpanan file besar di PostgreSQL.
- Penyimpanan data kartu pembayaran di aplikasi.

## Target non-fungsional

- Mobile-first dan dapat digunakan dengan keyboard.
- Semua mutasi penting idempotent.
- Audit untuk login, payment, order status, refund, dan perubahan admin.
- Tidak ada plaintext password atau token rahasia di database/log.
- Error pengguna ditampilkan dalam Bahasa Indonesia tanpa membocorkan detail internal.
