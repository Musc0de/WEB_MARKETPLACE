# Search, Category, dan Wishlist — Mobile

## Tujuan

Memberi search-first experience, filter sheet, dan wishlist yang mudah dipindah ke cart.

## Route

`/search`, `/categories/{slug}`, `/wishlist`

## Komposisi

Search dapat dedicated full-screen route dengan recent/popular before typing. Category memakai
chips/accordion. Wishlist item tampil sebagai compact card dengan Add to Cart dan overflow action.

## Komponen utama

Mobile search field, suggestion list, category chips, wishlist cards, price/stock alert badge.

## Interaksi dan validasi

Keyboard action search menutup keyboard dan memuat result. Wishlist remove menyediakan Undo toast.
Guest merge tidak memblokir browsing.

## State wajib

No network, no result, empty wishlist, merge conflict, item unavailable.

## Gooey Toast

Bottom-center; Undo harus mudah disentuh dan tidak tertutup keyboard/bottom nav.

## Accessibility

Search input 16px untuk mencegah zoom iOS, result list labels, overflow action sheet accessible.

## Proposed source map

```text
apps/storefront/src/features/search/pages/mobile-search-page.tsx
apps/storefront/src/features/wishlist/pages/mobile-wishlist-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
