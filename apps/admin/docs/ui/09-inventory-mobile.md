# Admin Inventory — Mobile

## Tujuan

Melakukan lookup stock dan quick adjustment terbatas.

## Route

`/inventory`

## Komposisi

Search-first inventory cards, location filter sheet, movement detail, full-screen adjustment form.
Barcode/scan optional future enhancement.

## Komponen utama

Inventory cards, search, location sheet, adjustment form, movement list.

## Interaksi dan validasi

Adjustment confirmation prominently shows current, delta, result. High-risk/large adjustment may
require desktop or reauth.

## State wajib

Conflict, offline, stale, no result, permission.

## Gooey Toast

Bottom-center above sticky submit. Conflict error page-level + toast.

## Accessibility

Numeric keyboard, result readable, touch target, no color-only stock status.

## Proposed source map

```text
apps/admin/src/features/inventory/pages/mobile-inventory-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
