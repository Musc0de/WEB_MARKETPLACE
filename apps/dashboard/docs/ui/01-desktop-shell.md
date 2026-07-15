# Dashboard Client — Desktop Shell

## Tujuan

Menyediakan navigation konsisten untuk seluruh self-service client.

## Route

`dashboard.starsuperscare.net/*`

## Komposisi

Sidebar 256–280px dengan section: Dashboard, Orders, History, Invoices/Downloads, Wishlist,
Addresses/Payment, Returns/Refunds, Reviews, Notifications, Support, Settings. Topbar memuat page
context, search bila relevan, notification badge, account menu, dan kembali belanja.

## Komponen utama

Dashboard sidebar, topbar, breadcrumbs, page header, content container, responsive toaster, session
guard.

## Interaksi dan validasi

Sidebar collapse optional. Active state berdasarkan route. Account menu dan notification menu tidak
konflik. Protected route menunjukkan session loading sebelum redirect.

## State wajib

Session loading, no permission, maintenance, stale notification count.

## Gooey Toast

Top-right dengan offset di bawah topbar. Persistent notification tidak digantikan toast.

## Accessibility

Skip link, nav landmark, current page state, keyboard collapse, focus after route change.

## Proposed source map

```text
apps/dashboard/src/layouts/dashboard-layout.tsx
apps/dashboard/src/navigation/dashboard-nav.ts
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
