# Client Dashboard

**Domain:** `dashboard.starsuperscare.net`

Dashboard hanya dapat diakses oleh session client yang valid.

## Menu desktop

```text
Dashboard
Pesanan Saya
Riwayat Pembelian
Invoice
Download Digital
Wishlist
Alamat
Metode Pembayaran
Retur & Refund
Ulasan
Notifikasi
Bantuan
Pengaturan
Keluar
```

## Bottom navigation mobile

```text
Home | Orders | Cart | Notifications | Account
```

`Cart` menuju `shop.starsuperscare.net/cart`.

## Data

Dashboard membaca API yang sama dengan storefront. Tidak ada database connection di browser. Semua
tanggal ditampilkan `id-ID` dan `Asia/Jakarta`.

## UI/UX V2

Mulai dari `docs/ui/00-scope-and-routes.md`. Shell, home, profile/security, orders,
history/invoices/downloads, commerce data, notifications, returns/refunds, support/reviews/settings
memiliki spesifikasi desktop dan mobile.
