# Loading, Empty, Error, and Offline

## Loading

Gunakan skeleton yang menyerupai layout final. Spinner tunggal hanya untuk area kecil atau action.

## Empty

Bedakan:

- Belum ada data.
- Tidak ada hasil filter.
- Tidak punya akses.
- Data selesai/archived.

Setiap empty state menawarkan action relevan, misalnya reset filter atau mulai belanja.

## Error

Pertahankan content yang masih valid. Berikan retry scoped, bukan reload seluruh app.

## Offline

Tampilkan banner non-blocking. Jangan mengizinkan payment/checkout submit ketika koneksi terputus. Cart lokal dapat dipertahankan lalu disinkronkan setelah online.
