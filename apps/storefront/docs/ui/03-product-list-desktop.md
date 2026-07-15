# Product Listing — Desktop

## Tujuan

Memungkinkan comparison cepat dengan filter dan sort yang dapat dibagikan melalui URL.

## Route

`/products`, `/categories/{slug}`, `/search?q=...`

## Komposisi

Page header berisi title, result count, active filter chips, dan sort. Filter sidebar 260–300px;
grid 3–4 kolom. Pagination berada setelah grid. Search result menampilkan query dan suggestion bila
typo/no result.

## Komponen utama

- Filter groups
- Price range
- Stock/promo/rating controls
- Sort select
- Active filter chips
- `ProductCard`
- Pagination
- Result summary

## Interaksi dan validasi

Semua filter menulis query parameter. Apply filter dapat langsung atau explicit sesuai kompleksitas;
jangan campur perilaku tanpa indikator. Clear all tersedia. Back/forward browser memulihkan state.

## State wajib

Initial loading, filter loading dengan existing grid retained, no products, no filter result,
partial image failure, API error.

## Gooey Toast

Filter applied tidak perlu toast. Wishlist/add-to-cart memakai toast. Error fetch memakai error
toast hanya sekali dan inline retry.

## Accessibility

Filter controls berlabel, result count diumumkan secara sopan, focus tidak lompat ke atas setelah
filter kecuali user memilih apply.

## Proposed source map

```text
apps/storefront/src/features/catalog/pages/product-list-page.tsx
apps/storefront/src/features/catalog/components/desktop-filter-sidebar.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
