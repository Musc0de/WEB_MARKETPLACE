# Product Listing — Mobile

## Tujuan

Menyediakan katalog yang cepat tanpa sidebar dan tanpa kehilangan filter state.

## Route

`/products`, `/categories/{slug}`, `/search?q=...`

## Komposisi

Sticky compact toolbar berisi `Filter`, `Sort`, result count, dan optional view toggle. Filter
dibuka sebagai bottom sheet/full-screen sheet; sort sebagai sheet pendek. Product grid dua kolom,
turun menjadi satu kolom pada width sangat kecil atau accessibility zoom.

## Komponen utama

- Mobile filter sheet
- Sort sheet
- Active filter horizontal chips
- Mobile ProductCard
- Load-more atau pagination
- Back-to-top optional

## Interaksi dan validasi

Filter draft tidak mengubah URL sampai Apply. Tombol Apply menampilkan jumlah hasil bila tersedia.
Close tanpa apply mempertahankan state lama. Focus kembali ke trigger.

## State wajib

Sheet loading, no result, network retry, filter invalid, product unavailable.

## Gooey Toast

Toast di atas bottom controls. Filter apply tidak perlu toast; add-to-cart/wishlist memakai
success/info. Error tetap inline.

## Accessibility

Sheet focus trap, drag handle bukan satu-satunya close control, chips dapat dihapus keyboard/screen
reader.

## Proposed source map

```text
apps/storefront/src/features/catalog/components/mobile-filter-sheet.tsx
apps/storefront/src/features/catalog/pages/mobile-product-list-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
