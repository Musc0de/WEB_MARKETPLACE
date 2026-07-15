# Typography and Content Style

## Bahasa

UI utama menggunakan Bahasa Indonesia yang ringkas dan konsisten. Istilah status mengikuti domain backend tetapi dipetakan ke label manusia.

## Label

- Gunakan kata kerja: `Simpan perubahan`, `Tambah ke keranjang`, `Ajukan retur`.
- Hindari label ambigu seperti `OK` atau `Submit`.
- Harga memakai `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
- Waktu ditampilkan dengan locale `id-ID` dan zona `Asia/Jakarta`.

## Error copy

Format:

```text
Apa yang gagal + alasan yang diketahui + tindakan berikutnya
```

Contoh: `Pembayaran belum dapat diverifikasi. Saldo Anda belum dipotong. Coba periksa kembali dalam beberapa menit.`

## Status

Tampilkan label dan penjelasan singkat untuk status yang berpotensi membingungkan seperti pending, processing, partially refunded, dan awaiting shipment.
