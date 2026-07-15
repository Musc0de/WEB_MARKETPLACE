# Cart — Mobile

## Tujuan

Membuat review cart dan checkout nyaman dalam satu kolom.

## Route

`/cart`

## Komposisi

Item sebagai vertical cards. Voucher dan order note menjadi accordion/sheet. Order summary berada
sebelum sticky Checkout bar atau pada expandable summary. Sticky bar menampilkan selected count,
total, dan Checkout.

## Komponen utama

Mobile cart item, compact quantity stepper, sticky checkout bar, voucher sheet, save-for-later
section.

## Interaksi dan validasi

Selection dan quantity tetap terlihat. Sticky bar disabled dengan alasan jelas. Swipe action tidak
wajib; selalu sediakan visible remove/menu.

## State wajib

Empty, stock conflict, price update, keyboard open, sticky bar collision, offline.

## Gooey Toast

Bottom-center di atas sticky checkout bar. Undo remove dan price warning menggunakan duration cukup.

## Accessibility

Touch target, sticky bar tidak menutupi last item, quantity update announced, checkbox label jelas.

## Proposed source map

```text
apps/storefront/src/features/cart/pages/mobile-cart-page.tsx
apps/storefront/src/features/cart/components/mobile-cart-footer.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
