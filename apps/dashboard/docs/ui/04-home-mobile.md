# Dashboard Home — Mobile

## Tujuan

Menampilkan prioritas tertinggi tanpa dashboard padat.

## Route

`/home`

## Komposisi

Greeting, critical alert, horizontally scrollable summary cards atau 2×2 grid, active order card,
quick actions, recent notification, recommendation rail. Prioritaskan active order dan pending
payment.

## Komponen utama

Compact summary, active order card, quick action grid, notification card, product rail.

## Interaksi dan validasi

Cards tap membuka destination. Jangan membuat seluruh large card clickable bila memiliki action
nested yang membingungkan.

## State wajib

No orders, payment action required, loading, offline, stale data.

## Gooey Toast

Bottom-center above nav. Live update toast tidak menumpuk lebih dari satu.

## Accessibility

Readable cards, horizontal rail controls/semantics, status labels.

## Proposed source map

```text
apps/dashboard/src/features/home/pages/mobile-home-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
