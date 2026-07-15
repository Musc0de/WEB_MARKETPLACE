# Admin Orders, Payments, dan Invoices — Desktop

## Tujuan

Mengelola fulfillment, payment verification context, invoice, shipment, dan customer communication.

## Route

`/orders`, `/payments`, `/invoices`

## Komposisi

Orders table with saved filters and batch fulfillment where allowed. Detail has status timeline,
items, address, payment events, invoice, shipment, notes, audit. Payments table read-only/provider
actions guarded. Invoice resend/regenerate based on policy.

## Komponen utama

Order table, detail tabs/sections, status action, shipment form, payment event list, invoice
preview/resend, internal notes.

## Interaksi dan validasi

Status transition validated server-side. Duplicate webhook/event visible but deduped. Refund/cancel
requires reason and impact. Resend email has rate limits.

## State wajib

Pending, paid, fulfillment, split shipment, failed payment, disputed, cancelled, partial/full
refund, invoice generating.

## Gooey Toast

Promise for status action/resend; batch summary; provider failure error + reference id.

## Accessibility

Timeline, exact monetary breakdown, address privacy, confirmation, table keyboard.

## Proposed source map

```text
apps/admin/src/features/orders/
apps/admin/src/features/payments/
apps/admin/src/features/invoices/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
