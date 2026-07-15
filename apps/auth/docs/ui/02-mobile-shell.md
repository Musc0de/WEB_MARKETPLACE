# Auth Mobile Shell

## Tujuan

Menyelesaikan authentication dengan satu tangan dan keyboard-safe layout.

## Route

`auth.starsuperscare.net/*`

## Komposisi

Full-height min layout; compact logo/header; form satu kolom; primary CTA full width. Legal/support
berada setelah form. Tidak ada sticky footer yang menutupi keyboard.

## Komponen utama

Mobile auth header, auth form container, password reveal button, bottom-safe toast.

## Interaksi dan validasi

Saat keyboard muncul, field aktif dan CTA tetap dapat discroll. Browser password manager tidak rusak
oleh custom field.

## State wajib

Keyboard open, slow network, token expired, offline, orientation change.

## Gooey Toast

Bottom-center safe-area + 16px karena auth tidak memakai bottom nav. Inline error tetap utama.

## Accessibility

Input font 16px, touch target 44px, autocomplete attributes benar, focus tidak terperangkap.

## Proposed source map

```text
apps/auth/src/layouts/mobile-auth-layout.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
