# Payment Methods

## URL

`dashboard.starsuperscare.net/payment-methods`

## Scope

Halaman ini hanya tersedia bila payment provider mendukung penyimpanan metode pembayaran melalui tokenisasi/provider vault.

## Informasi yang boleh ditampilkan

- Jenis metode pembayaran.
- Brand kartu atau channel.
- Empat digit terakhir bila diberikan provider.
- Bulan/tahun kedaluwarsa bila relevan.
- Nama label buatan client.
- Status default dan waktu terakhir digunakan.

## Informasi yang dilarang disimpan aplikasi

- Nomor kartu penuh.
- CVV/CVC.
- PIN/OTP.
- Raw banking credential.

Database hanya menyimpan `provider`, `provider_customer_id`, `provider_payment_method_id`, display metadata, status, dan timestamps.

## Aksi

- List metode tersimpan.
- Set default.
- Hapus/revoke.
- Tambah melalui secure provider flow.

## API

```text
GET    /v1/me/payment-methods
POST   /v1/me/payment-methods/setup
PATCH  /v1/me/payment-methods/{id}/default
DELETE /v1/me/payment-methods/{id}
```

Semua aksi harus memverifikasi ownership. Penambahan metode dilakukan melalui UI/SDK provider agar raw credential tidak melewati server aplikasi.

## Toast

- `Metode pembayaran berhasil ditambahkan`.
- `Metode pembayaran utama diperbarui`.
- `Metode pembayaran berhasil dihapus`.
