# Product List dan Product Card

## URL

```text
shop.starsuperscare.net/products
shop.starsuperscare.net/categories/{category_slug}
shop.starsuperscare.net/search?q={keyword}
```

## Isi product card final

```text
┌──────────────────────────────────────────┐
│               [Foto Produk]              │
│ [Promo] [Terlaris]                       │
│ Brightening Serum 30ml                   │
│ Star Super Care                          │
│ ~~Rp150.000~~  Rp125.000  -17%           │
│ ★ 4,8 · 125 ulasan                       │
│ Terjual 1,2 rb · Tersedia 25             │
│ [Tambah ke Keranjang]                    │
│ [Beli Sekarang]              [♡]         │
└──────────────────────────────────────────┘
```

## Field API

- `id`, `slug`, `name`, `brand`, `category`.
- `primary_image` dan alt text.
- `regular_price`, `sale_price`, `discount_percentage`, `currency`.
- `rating_average`, `review_count`.
- `net_sold_quantity`, `sold_label`.
- `available_stock`, `stock_status`.
- `product_type`, badges, dan default variant.

## Aturan sold

```text
gross_sold = quantity order yang payment_status = paid
refunded_sold = quantity refund yang sudah finalized
net_sold = gross_sold - refunded_sold
```

Jangan menambah sold saat item hanya berada di cart. Source of truth tetap `order_items` dan refund;
tabel statistik hanya cache.

Format tampilan:

```text
1-999      -> Terjual 125
1.000+     -> Terjual 1,2 rb
10.000+    -> Terjual 10 rb+
```

Bila `net_sold = 0`, tampilkan badge `Baru` bila produk memenuhi aturan produk baru; jangan wajib
menampilkan `Terjual 0`.

## Interaksi

- `Tambah ke Keranjang`: tambah default variant atau buka variant picker.
- `Beli Sekarang`: tambah item lalu arahkan ke checkout.
- `Wishlist`: guest disimpan lokal; user disimpan API.
- Out of stock: disable tombol dan tampilkan `Beri tahu saya`.

## Gooey Toast

- Success: `Produk ditambahkan ke keranjang`.
- Warning: `Stok hanya tersisa 2`.
- Error: `Produk tidak tersedia`.
- Promise toast dipakai untuk add-to-cart yang menunggu API.

## Acceptance criteria

- Harga IDR terformat locale `id-ID`.
- Card tidak layout shift ketika gambar loading.
- Keyboard dan screen reader dapat mengakses semua tombol.
- Product link memakai slug canonical.
