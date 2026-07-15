# Admin Overview — Desktop

## Tujuan

Menampilkan operational health dan task yang memerlukan tindakan.

## Route

`/overview`

## Komposisi

KPI cards: paid orders, revenue, pending fulfillment, low stock, refund queue, failed jobs. Trend
charts optional. Work queues dan recent audit. Date/store filter.

## Komponen utama

KPI cards, trend chart, queue cards/table, health panel, date filter, shortcuts.

## Interaksi dan validasi

KPI link to filtered module. Refresh timestamp and stale indicator. Chart never sole source of exact
values.

## State wajib

Loading, partial metric failure, no data, stale, permission-limited.

## Gooey Toast

Realtime high-priority event may toast; metric refresh does not. Export/report uses promise/result.

## Accessibility

Chart textual summary, exact values, filters, status not color-only.

## Proposed source map

```text
apps/admin/src/features/overview/pages/overview-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
