# Notifications

## URL

`dashboard.starsuperscare.net/notifications`

## Jenis

- Order diterima/diproses/dikirim/selesai.
- Payment sukses/gagal.
- Refund dan return.
- Voucher.
- Perubahan akun/security.
- Produk wishlist turun harga/restock.

## Data model

Gunakan `read_at` sebagai source of truth:

```text
read_at IS NULL     -> unread
read_at IS NOT NULL -> read
```

Jangan menyimpan `status` dan `read_at` sebagai dua sumber yang dapat tidak sinkron.

## Arsitektur MVP

```text
Business transaction
      -> outbox_events
      -> Deno worker
      -> notifications table
      -> SSE publish
      -> dashboard browser
```

SSE endpoint:

`GET api.starsuperscare.net/v1/notifications/stream`

REST tetap dipakai untuk list, mark read, mark all read, dan pagination.

## Gooey Toast

SSE event baru dapat memunculkan toast, tetapi toast bukan penyimpanan notifikasi. Notification
center tetap mengambil data dari database.

## Scale-up

Tambahkan broker seperti Kafka hanya ketika event volume, banyak consumer, retention, replay, dan
pemisahan service benar-benar membutuhkannya.
