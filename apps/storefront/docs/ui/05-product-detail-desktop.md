# Product Detail — Desktop

## Tujuan

Membantu user memahami produk, memilih varian, memeriksa stok, dan membeli dengan confidence.

## Route

`/products/{slug}`

## Komposisi

Gallery kiri 55–60%; purchase summary kanan sticky. Summary: brand, title, rating/review, sold,
price, discount, variant, stock, quantity, delivery estimate, CTA. Di bawah: description,
benefits/spec, digital delivery, reviews, Q&A, related products.

## Komponen utama

- Product gallery/zoom
- Price block
- Variant selector
- Stock/sold display
- Quantity stepper
- Add to cart / Buy now / Wishlist
- Shipping estimator
- Review summary/list
- Related products

## Interaksi dan validasi

Changing variant updates price, images, SKU, stock, availability, and URL/query where appropriate.
Quantity clamped by stock and purchase limits. Buy Now creates/selects item then routes to checkout
without duplicating cart entries unexpectedly.

## State wajib

Product loading, discontinued, out of stock, variant unavailable, price changed, review empty, image
failure.

## Gooey Toast

Add to cart success + `Lihat keranjang`; wishlist info/success; price/stock conflict warning;
buy-now failure error with retry.

## Accessibility

Gallery keyboard, thumbnails labeled, variant controls radio semantics, price changes announced,
quantity buttons named.

## Proposed source map

```text
apps/storefront/src/features/catalog/pages/product-detail-page.tsx
apps/storefront/src/features/catalog/components/purchase-panel.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
