# Admin Login — Mobile

## Tujuan

Memberi emergency/monitoring access dengan authentication yang tetap aman.

## Route

`/login`

## Komposisi

Single column, environment label persistent, full-width fields/CTA, 2FA numeric input, help path.

## Komponen utama

Mobile admin login, 2FA step, security notice.

## Interaksi dan validasi

Keyboard-safe; paste OTP allowed; prevent accidental multiple submit.

## State wajib

Invalid, rate limited, 2FA, unsupported operation notice.

## Gooey Toast

Bottom-center safe-area + 16px; error inline.

## Accessibility

16px input, 44px controls, OTP label, no customer auth links.

## Proposed source map

```text
apps/admin/src/features/auth/pages/mobile-admin-login-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
