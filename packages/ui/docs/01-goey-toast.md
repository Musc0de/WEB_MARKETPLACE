# Integrasi goey-toast

`goey-toast` dipakai untuk feedback sementara, bukan sebagai database notifikasi.

## Setup

- Install package dan peer dependencies React/Framer Motion.
- Import stylesheet satu kali pada entry frontend.
- Render satu `<GoeyToaster />` pada root setiap app.
- Bungkus API package dalam helper `notify` agar teks, durasi, dan error mapping konsisten.

## Mapping

```text
success -> add cart, save profile, mark read
error   -> API failure, invalid action
warning -> low stock, changed price
info    -> background update, shipping update
promise -> submit form, checkout validation, download generation
```

## Contoh kebijakan pesan

- Judul singkat maksimal satu kalimat.
- Detail teknis tidak ditampilkan.
- Error form tetap ditampilkan inline pada field.
- Jangan menampilkan toast berulang untuk setiap SSE reconnect.
- Gunakan action button hanya untuk aksi aman seperti `Lihat Keranjang` atau `Coba Lagi`.

## Persistent notification

Order/payment notification tetap dibuat pada `notifications` table. SSE hanya memberi sinyal realtime, lalu client memperbarui list dan menampilkan toast bila sesuai preference.
