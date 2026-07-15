# Admin Orders, Payments, dan Invoices — Mobile

## Tujuan

Mendukung lookup dan high-priority operational action pada mobile.

## Route

`/orders`, `/payments`, `/invoices`

## Komposisi

Search/status chips, order cards, detail sections, primary eligible action sticky. Payment/invoice
shown as compact records. Complex batch action omitted.

## Komponen utama

Order cards, filter sheet, status timeline, action sheet, invoice/payment records.

## Interaksi dan validasi

Status transition confirmation. Sensitive data minimized. Shipment tracking input keyboard-safe.

## State wajib

No result, pending, conflict, provider unavailable, invoice pending.

## Gooey Toast

Bottom-center above sticky action/nav. Status result persistent.

## Accessibility

Touch target, timeline, identifiers copy action labeled, no hover.

## Proposed source map

```text
apps/admin/src/features/orders/pages/mobile-orders-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
