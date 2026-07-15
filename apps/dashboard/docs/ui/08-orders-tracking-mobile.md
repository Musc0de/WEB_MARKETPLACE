# Orders dan Tracking — Mobile

## Tujuan

Melihat order sebagai cards dan detail/timeline satu kolom.

## Route

`/orders`, `/orders/{id}`, `/orders/{id}/tracking`

## Komposisi

Status chips horizontal + filter sheet. Order card memuat number/date/status/total/primary action.
Detail section cards/accordion; sticky relevant action bila ada. Tracking timeline vertical.

## Komponen utama

Order cards, status chips, filter sheet, mobile timeline, sticky action, invoice action sheet.

## Interaksi dan validasi

Filter state URL-persisted. Expand item detail tidak kehilangan scroll. Buy again routes to
storefront/cart.

## State wajib

Empty, split shipment, tracking delayed, no network, refunded.

## Gooey Toast

Bottom-center above nav/sticky action. Live tracking info tidak spam; dedupe by event id.

## Accessibility

Timeline text, status not color-only, cards have clear headings, action sheet accessible.

## Proposed source map

```text
apps/dashboard/src/features/orders/pages/mobile-orders-page.tsx
apps/dashboard/src/features/orders/pages/mobile-order-detail-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
