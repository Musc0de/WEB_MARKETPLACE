# Admin Tablet/Mobile Shell

## Tujuan

Memungkinkan monitoring dan quick action tanpa memaksakan table desktop pada layar kecil.

## Route

`admin.starsuperscare.net/*`

## Komposisi

Compact topbar + navigation drawer. Overview cards satu/two columns. Data tables menjadi cards atau
limited horizontal data grid. Primary action in header; filters in sheet. High-risk bulk operation
dapat menampilkan desktop-required message.

## Komponen utama

Admin mobile header, nav drawer, filter sheet, record cards, action sheet, environment banner.

## Interaksi dan validasi

Drawer focus trap. Mobile action menu shows only authorized operations. Do not hide critical
production environment context.

## State wajib

Permission, read-only, offline, table fallback, long identifiers.

## Gooey Toast

Bottom-center above safe area/sticky action. Batch operation generally not initiated mobile unless
designed.

## Accessibility

Touch targets, drawer labels, card information hierarchy, no hover-only controls.

## Proposed source map

```text
apps/admin/src/layouts/mobile-admin-shell.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
