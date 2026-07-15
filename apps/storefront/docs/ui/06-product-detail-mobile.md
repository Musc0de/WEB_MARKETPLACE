# Product Detail — Mobile

## Tujuan

Menyediakan detail penuh dengan CTA pembelian yang selalu terjangkau tanpa menutupi konten.

## Route

`/products/{slug}`

## Komposisi

Gallery full width di atas. Ringkasan product satu kolom. Long content memakai accordion. Sticky
bottom purchase bar memuat harga ringkas dan primary CTA; variant/quantity dapat dibuka dalam bottom
sheet bila kompleks.

## Komponen utama

- Swipe gallery + indicator
- Product summary
- Variant chips/sheet
- Sticky purchase bar
- Accordion details
- Review cards
- Related product rail

## Interaksi dan validasi

Sticky CTA tidak menutupi anchor atau last content. Saat keyboard/variant sheet terbuka, bar
menyesuaikan. Out-of-stock mengganti CTA dengan notify-me/wishlist sesuai fitur.

## State wajib

Same states as desktop plus sticky bar hidden/visible, sheet state, orientation change.

## Gooey Toast

Bottom-center di atas sticky purchase bar. Add-to-cart action `Lihat`; warning stok tidak
auto-dismiss terlalu cepat.

## Accessibility

Swipe bukan satu-satunya navigasi gallery, CTA 44px+, accordion state announced, focus masuk ke
sheet heading.

## Proposed source map

```text
apps/storefront/src/features/catalog/pages/mobile-product-detail-page.tsx
apps/storefront/src/features/catalog/components/mobile-purchase-bar.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
