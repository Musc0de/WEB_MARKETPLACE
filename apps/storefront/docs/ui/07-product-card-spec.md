# Product Card Specification

## Informasi wajib

1. Product image.
2. Badges: Baru, Promo, Terlaris, Digital bila relevan.
3. Nama produk maksimal dua baris.
4. Brand.
5. Harga normal dan harga jual.
6. Persentase diskon.
7. Rating dan jumlah ulasan.
8. `Terjual` dari `net_sold`.
9. Stok/availability.
10. Add to cart, Buy now, Wishlist sesuai context.

## Contoh

```text
[Promo] [Terlaris]
Brightening Serum 30ml
Star Super Care
Rp150.000  Rp125.000  -17%
★ 4,8 · 125 ulasan
Terjual 1,2 rb · Tersedia 25
[Tambah ke Keranjang] [Beli Sekarang] [♡]
```

## Sold display

- `0`: tampilkan `Baru` bila produk baru; jangan memalsukan penjualan.
- `1–999`: angka asli.
- `1.000–9.999`: format satu desimal `1,2 rb`.
- `≥10.000`: format ringkas konsisten.
- Sumber: paid quantity minus finalized refunded quantity.

## Desktop

Card action dapat muncul penuh atau tetap terlihat sesuai grid. Hover tidak boleh menjadi
satu-satunya cara melihat CTA.

## Mobile

Prioritaskan image, title, price, rating/sold. Tombol Add to Cart full-width atau icon+label; Buy
Now dapat berada pada detail page bila card terlalu padat.

## States

Loading, image failure, unavailable, out-of-stock, price changed, wishlist pending, add-to-cart
pending.

## Toast

Action card menggunakan shared `notify`, bukan toaster lokal pada card.
