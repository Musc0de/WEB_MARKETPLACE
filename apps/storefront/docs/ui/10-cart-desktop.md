# Cart — Desktop

## Tujuan

Membantu user memeriksa item, quantity, availability, discount, shipping estimate, dan total sebelum
checkout.

## Route

`/cart`

## Komposisi

Dua kolom: item list 65–70%, order summary sticky 30–35%. Item row memuat selection, image,
title/variant, price, quantity, stock warning, save-for-later, remove. Summary memuat subtotal,
discount, shipping estimate, tax bila ada, total, voucher, dan Checkout CTA.

## Komponen utama

Cart item row, quantity stepper, select all, voucher form, order note, summary, continue shopping,
checkout button.

## Interaksi dan validasi

Server menghitung ulang total. Quantity update dapat optimistic tetapi rollback saat conflict.
Remove menyediakan Undo. Checkout memvalidasi selected items, stock, price, dan session
requirements.

## State wajib

Empty cart, loading, partial unavailable, price changed, stock insufficient, voucher
invalid/expired, sync conflict.

## Gooey Toast

Remove: info + Undo. Voucher accepted/rejected: success/error dengan inline detail. Cart refreshed
due to price: warning.

## Accessibility

Quantity control labels, summary landmark, errors linked to item, focus after remove berpindah
logis.

## Proposed source map

```text
apps/storefront/src/features/cart/pages/cart-page.tsx
apps/storefront/src/features/cart/components/cart-summary.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
