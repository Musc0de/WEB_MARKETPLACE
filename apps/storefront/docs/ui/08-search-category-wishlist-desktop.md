# Search, Category, dan Wishlist — Desktop

## Tujuan

Mempermudah discovery dan menyimpan produk tanpa membingungkan guest/account ownership.

## Route

`/search`, `/categories/{slug}`, `/wishlist`

## Komposisi

Search mempunyai query header, suggestion, filter, recent/popular term. Category mempunyai intro
singkat dan subcategory navigation. Wishlist memakai grid/list dengan stock/price-change indicators
dan bulk add/remove opsional.

## Komponen utama

Search combobox, suggestion panel, category navigation, wishlist product rows/cards, stock alert
controls.

## Interaksi dan validasi

Guest wishlist disimpan lokal; ketika login, merge idempotent dan tampilkan summary bila ada
conflict. Removing item dapat optimistic dengan Undo.

## State wajib

No search result, empty wishlist, merge pending/conflict, unavailable product, price changed.

## Gooey Toast

Wishlist removed: info + Undo. Merge complete: success summary. Search failure: error + inline
retry.

## Accessibility

Combobox pattern benar, result announcement, Undo action keyboard, empty CTA menuju products.

## Proposed source map

```text
apps/storefront/src/features/search/
apps/storefront/src/features/wishlist/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
