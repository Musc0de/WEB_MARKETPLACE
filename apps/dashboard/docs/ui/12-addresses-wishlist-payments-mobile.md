# Addresses, Wishlist, dan Payment Methods — Mobile

## Tujuan

Mengelola cards/forms satu kolom dengan action menu yang aman.

## Route

`/addresses`, `/wishlist`, `/payment-methods`

## Komposisi

Cards stacked. Add button in page header/FAB only if accessible. Address/payment edit uses
full-screen page or bottom sheet for short selection, not long form. Wishlist item cards compact.

## Komponen utama

Mobile cards, full-screen address form, payment method sheet, wishlist item actions.

## Interaksi dan validasi

Visible default badge. Overflow menu includes edit/delete but primary use action remains visible.
Add to cart routes/updates storefront cart.

## State wajib

Empty, provider error, validation, keyboard, item unavailable.

## Gooey Toast

Bottom-center above nav/sticky form save. Delete error persistent inline where relevant.

## Accessibility

Touch target, masked payment label, address semantic grouping, confirmation dialog.

## Proposed source map

```text
apps/dashboard/src/features/addresses/pages/mobile-addresses-page.tsx
apps/dashboard/src/features/payment-methods/pages/mobile-payment-methods-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
