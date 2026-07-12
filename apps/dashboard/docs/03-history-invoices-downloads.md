# History, Invoices, dan Downloads

## History

`dashboard.starsuperscare.net/history?page=1&per_page=5`

Default `per_page=5`. Filter:

```text
status
year
start_date=2026-01-01
end_date=2026-07-12
```

Ringkasan:

- Total transaksi.
- Total nominal pembelian.
- Order selesai.
- Total refund.
- Periode.

Semua query date memakai format ISO `YYYY-MM-DD`; UI menampilkan format Indonesia.

## Invoices

```text
/dashboard/invoices
/dashboard/invoices/{invoice_number}
```

Fitur: lihat, download PDF, filter tanggal/status, cari nomor invoice. Download memakai signed URL
dan authorization check.

## Digital downloads

`dashboard.starsuperscare.net/downloads`

Tampilkan:

- Produk dan order.
- Versi asset.
- Sisa download.
- Expiry.
- Tombol download.
- License key bila berlaku.

API membuat signed URL singkat setelah memverifikasi entitlement. Catat download audit, tetapi
jangan log URL rahasia.
