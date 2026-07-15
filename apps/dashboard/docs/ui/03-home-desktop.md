# Dashboard Home — Desktop

## Tujuan

Memberi ringkasan order aktif, pembayaran, total pembelian, notification, dan shortcut.

## Route

`/home`

## Komposisi

Greeting + account status. Summary cards: active orders, awaiting payment, in transit, total
purchase. Recent orders table/cards. Notification preview. Quick actions. Recommendations dari
storefront dipisahkan sebagai commerce section.

## Komponen utama

Summary cards, recent order list, payment alert, notification preview, quick actions,
recommendations.

## Interaksi dan validasi

Click summary applies filter to Orders/History. Alerts have clear CTA. Recommendation opens
storefront product detail.

## State wajib

Loading cards, no orders, pending payment, no notifications, recommendation unavailable.

## Gooey Toast

Payment/order changes may produce toast when arriving live via SSE; notification remains persistent.

## Accessibility

Cards headings, status not color-only, table/card accessible, live updates polite.

## Proposed source map

```text
apps/dashboard/src/features/home/pages/home-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
