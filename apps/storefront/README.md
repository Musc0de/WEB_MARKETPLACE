# Storefront App

**Domain:** `shop.starsuperscare.net`

## Tanggung jawab

- Product list, category, search, product detail.
- Guest/user cart.
- Wishlist sementara dan sinkronisasi setelah login.
- Checkout address, shipping, payment, review, success/failure.
- Tidak menampilkan data privat dashboard.

## Struktur fitur

```text
src/features/catalog/
src/features/product/
src/features/cart/
src/features/checkout/
src/features/search/
src/features/wishlist/
```

## State penting

- Cart server menjadi sumber data utama.
- Guest menyimpan token cart opaque dalam cookie/local storage, bukan seluruh harga terpercaya.
- Harga, diskon, stok, dan ongkir selalu dihitung ulang API.
- UI dapat optimistic untuk quantity, tetapi harus rollback bila API menolak.

## Navigasi

```text
/                         storefront home
/products                 product list
/products/{slug}          detail produk
/categories/{slug}        kategori
/search?q=...             pencarian
/cart                     cart
/checkout/*               checkout wizard
```
