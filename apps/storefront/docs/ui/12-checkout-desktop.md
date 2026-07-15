# Checkout — Desktop

## Tujuan

Menyelesaikan pembelian dengan langkah jelas, summary konsisten, dan pencegahan duplicate submit.

## Route

`/checkout/address`, `/shipping`, `/payment`, `/review`, `/success`

## Komposisi

Stepper horizontal. Form utama kiri; order summary sticky kanan. Address picker, shipping option,
payment option, voucher, review, consent. Success page menampilkan order number, invoice/email
status, activation information bila guest, dan next actions.

## Komponen utama

Checkout stepper, address form/cards, shipping options, payment method, order summary, terms
checkbox, idempotent submit button.

## Interaksi dan validasi

Setiap step divalidasi server sebelum lanjut. Back mempertahankan data non-sensitif. Place order
disabled during submit. Payment redirect/return mempunyai pending verification state.

## State wajib

Loading quote, no shipping method, digital-only skip, payment pending/failed/success, duplicate
submission replay, guest activation notice.

## Gooey Toast

Promise toast untuk save address/short action, bukan untuk keseluruhan payment redirect. Payment
failure tampil inline/page-level + error toast. Success page tidak bergantung pada toast.

## Accessibility

Stepper semantics, error summary, form labels, focus heading after route step change, total changes
announced.

## Proposed source map

```text
apps/storefront/src/features/checkout/layouts/checkout-layout.tsx
apps/storefront/src/features/checkout/pages/*
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
