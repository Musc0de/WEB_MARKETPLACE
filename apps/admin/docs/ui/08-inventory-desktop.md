# Admin Inventory — Desktop

## Tujuan

Melihat stock by location, movement ledger, reservation, dan melakukan adjustment aman.

## Route

`/inventory`

## Komposisi

Inventory table with product/variant/location/available/reserved/damaged. Filter and export.
Adjustment drawer/page requires type, quantity delta, reason, reference, preview balance. Movement
ledger and low-stock queue.

## Komponen utama

Inventory table, adjustment form, movement ledger, location filter, low stock panel, export.

## Interaksi dan validasi

Server calculates resulting balance; prevent negative unless explicit authorized policy. Adjustment
idempotent and audited. Reservation changes not manually edited without dedicated action.

## State wajib

Loading, no stock, conflict, stale version, invalid delta, export pending.

## Gooey Toast

Adjustment success/error, conflict warning, export started/ready. Do not rely on toast for final
ledger.

## Accessibility

Numeric input labels, table semantics, confirmation impact, reason required.

## Proposed source map

```text
apps/admin/src/features/inventory/pages/inventory-page.tsx
apps/admin/src/features/inventory/components/adjustment-drawer.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
