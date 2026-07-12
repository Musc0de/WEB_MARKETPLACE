# Search dan Wishlist

## Search

`shop.starsuperscare.net/search?q={keyword}`

Filter: kategori, brand, tipe produk, harga, rating, stok, promo. Sorting: terbaru, harga naik/turun, terlaris, rating, dan paling relevan.

## Wishlist guest

- Simpan product/variant IDs secara lokal.
- Jangan menyimpan harga sebagai source of truth.
- Setelah signup/login, tawarkan sinkronisasi ke akun.

## Wishlist user

- Endpoint database-backed.
- Tampilkan perubahan harga dan stock.
- Tombol pindah ke cart harus revalidate varian.
- Notification opt-in untuk harga turun dan restock.

## Empty state

- Search kosong: produk populer dan kategori.
- No result: koreksi kata dan hapus filter.
- Wishlist kosong: CTA kembali ke products.
