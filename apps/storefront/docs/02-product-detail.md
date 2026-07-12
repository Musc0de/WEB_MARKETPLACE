# Product Detail

## URL

`shop.starsuperscare.net/products/{slug}`

## Bagian halaman

1. Breadcrumb.
2. Galeri gambar/video.
3. Nama, brand, SKU, badge, rating, review count, sold.
4. Harga normal/promo.
5. Pilihan varian dan quantity.
6. Stock status.
7. Add to cart, buy now, wishlist.
8. Deskripsi, spesifikasi, cara penggunaan, peringatan.
9. Informasi fulfillment fisik/digital.
10. Review terverifikasi dan produk terkait.

## Varian

Setiap varian mempunyai `variant_id`, SKU, harga, stok, berat, dimensi, gambar, dan status. Cart
menyimpan `variant_id`, bukan hanya `product_id`.

## Validasi

- Varian wajib dipilih bila lebih dari satu.
- Quantity minimal 1 dan maksimal stok/batas pembelian.
- Server memvalidasi ulang status produk, harga, diskon, dan stok.
- Slug lama diarahkan ke slug terbaru menggunakan redirect mapping.

## Produk digital

Tampilkan format file, ukuran, lisensi, kompatibilitas, jumlah download, dan kebijakan refund.
Jangan tampilkan URL file asli sebelum entitlement valid.

## SEO

Gunakan title, description, canonical URL, structured product data, alt text, Open Graph image,
serta status `noindex` untuk draft/inactive.
