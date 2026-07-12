# Support, Reviews, dan Settings

## Support

```text
/dashboard/support/faq
/dashboard/support/tickets
/dashboard/support/tickets/{ticket_number}
```

Fitur: buat tiket, kategori, kaitkan order, pesan, attachment, status, SLA label, dan riwayat.

## Reviews

`dashboard.starsuperscare.net/reviews`

- Produk eligible setelah order memenuhi status kebijakan.
- Review terhubung ke `order_item_id` untuk verified purchase.
- Satu review aktif per order item.
- Edit/hapus mengikuti moderation policy.
- Rating agregat diperbarui secara async atau transaction-safe.

## Settings

```text
/settings/profile
/settings/security
/settings/notifications
/settings/privacy
```

Notification preferences memisahkan transaksional wajib dan pemasaran opsional. Privacy page menyediakan export/request deletion workflow sesuai kebijakan hukum yang berlaku.
