# Orders dan Tracking

## List

`dashboard.starsuperscare.net/orders`

Kolom/card:

- Nomor order.
- Tanggal.
- Thumbnail dan ringkasan item.
- Total IDR.
- Payment status.
- Order status.
- Fulfillment/shipping status.
- Aksi detail, invoice, tracking.

Gunakan tab:

```text
Semua | Aktif | Selesai | Dibatalkan | Refund
```

## Detail

`dashboard.starsuperscare.net/orders/{order_number}`

Tampilkan snapshot order, timeline status, address, shipping, payment summary, invoice, item fisik/digital, refund, support link, buy again, dan review.

## Tracking

`dashboard.starsuperscare.net/orders/{order_number}/tracking`

Tracking publik opsional:

`tracking.starsuperscare.net/{tracking_token}`

Jangan memakai order ID mudah ditebak sebagai satu-satunya authorization untuk tracking publik.

## Buy again

Server memeriksa produk aktif, varian, harga terbaru, dan stok; item ditambahkan ke cart baru. Order lama tidak pernah diubah.
