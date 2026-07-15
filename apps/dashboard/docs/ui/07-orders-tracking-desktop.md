# Orders dan Tracking — Desktop

## Tujuan

Menemukan order aktif, memeriksa status pembayaran/pengiriman, invoice, dan detail item.

## Route

`/orders`, `/orders/{id}`, `/orders/{id}/tracking`

## Komposisi

Orders page: filter/status tabs, search, date filter, table/card hybrid. Detail: order
header/status, item list, payment summary, address, shipment, timeline, invoice actions, support
link. Tracking dapat embedded atau route terpisah.

## Komponen utama

Order filters, order table, status badges, order detail sections, timeline, shipment card,
invoice/download, buy again.

## Interaksi dan validasi

Buy again memvalidasi product availability/price dan menambah ke storefront cart. Cancel/confirm
received mengikuti eligible state. Tracking refresh tidak menambah duplicate events.

## State wajib

No orders, no filter result, payment pending, split shipment, cancelled, refunded, tracking
unavailable.

## Gooey Toast

Buy again success + View cart; cancel request result; tracking update live info. Status utama tetap
persistent.

## Accessibility

Table semantics, timeline ordered list, status description, action permission labels.

## Proposed source map

```text
apps/dashboard/src/features/orders/pages/orders-page.tsx
apps/dashboard/src/features/orders/pages/order-detail-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
