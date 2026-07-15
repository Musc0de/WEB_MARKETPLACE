# Dashboard Client — Mobile Shell

## Tujuan

Memberikan akses cepat ke fitur utama dengan bottom navigation dan secondary menu.

## Route

`dashboard.starsuperscare.net/*`

## Komposisi

Topbar compact dengan back/title/context action. Bottom nav: Home, Orders, Shop/Cart, Notifications,
Account. Fitur sekunder berada pada Account/More page. Content padding 16px dan safe-area.

## Komponen utama

Mobile topbar, bottom navigation, account menu page, badges, mobile page header, responsive toaster.

## Interaksi dan validasi

Bottom nav active state jelas. Route detail menyembunyikan atau mempertahankan nav sesuai kebutuhan,
tetapi back behavior konsisten. Shop action membuka storefront.

## State wajib

Session loading, notification badge pending, deep link detail, keyboard/form states.

## Gooey Toast

Bottom-center di atas bottom nav; pada form dengan sticky CTA, offset mengambil nilai terbesar.

## Accessibility

44px target, 5 nav item maximum, labels visible, focus order, safe-area.

## Proposed source map

```text
apps/dashboard/src/layouts/mobile-dashboard-shell.tsx
apps/dashboard/src/navigation/mobile-nav.ts
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
