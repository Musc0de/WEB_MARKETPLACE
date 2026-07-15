# Addresses, Wishlist, dan Payment Methods — Desktop

## Tujuan

Mengelola reusable commerce data dengan privacy dan provider constraints.

## Route

`/addresses`, `/wishlist`, `/payment-methods`

## Komposisi

Addresses/payment methods sebagai card grids dengan default badges. Wishlist sebagai product
grid/list. Add/edit address memakai page/drawer; payment method hanya token/brand/last4/expiry yang
diizinkan provider.

## Komponen utama

Address cards, address form, default action, payment token cards, remove dialog, wishlist grid.

## Interaksi dan validasi

Cannot expose raw card data. Setting default is optimistic only if rollback. Address delete blocked
if required by active flow according to rule. Wishlist add to cart validates stock.

## State wajib

No addresses, no payment methods, provider unavailable, expired method, wishlist empty/unavailable.

## Gooey Toast

Default changed success; remove with Undo only if reversible; payment error; wishlist to cart
success.

## Accessibility

Sensitive values masked, card labels, confirmation specific, address form semantics.

## Proposed source map

```text
apps/dashboard/src/features/addresses/
apps/dashboard/src/features/payment-methods/
apps/dashboard/src/features/wishlist/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
