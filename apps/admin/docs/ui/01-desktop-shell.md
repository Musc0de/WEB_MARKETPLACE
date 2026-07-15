# Admin Desktop Shell

## Tujuan

Menyediakan operational workspace padat data dengan navigation, search, filter, dan audit context.

## Route

`admin.starsuperscare.net/*`

## Komposisi

Sidebar 248–272px, topbar command/search, environment badge, notifications/tasks, user menu. Content
max width fleksibel sampai 1600px. Page header memuat title, breadcrumb, primary action, secondary
menu.

## Komponen utama

Admin sidebar, command palette, environment badge, page header, filter bar, task/notification panel,
responsive toaster.

## Interaksi dan validasi

Sidebar collapse, keyboard command palette, environment warning in staging/production. Route and
permission aware. Destructive/bulk action opens confirmation/result summary.

## State wajib

Session/permission loading, read-only mode, maintenance, partial service health.

## Gooey Toast

Top-right; max 3. Batch operation uses promise/update/result summary. Important failure also stays
in page panel.

## Accessibility

Keyboard nav, current location, command palette pattern, environment not color-only.

## Proposed source map

```text
apps/admin/src/layouts/admin-layout.tsx
apps/admin/src/navigation/admin-nav.ts
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
