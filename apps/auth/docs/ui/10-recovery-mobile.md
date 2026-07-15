# Forgot dan Reset Password — Mobile

## Tujuan

Menyelesaikan recovery dengan keyboard-safe form dan hasil yang tidak ambigu.

## Route

`/forgot-password`, `/reset-password`

## Komposisi

Satu kolom, full-width CTA, back to login link. Reset requirements tampil tepat di bawah password.

## Komponen utama

Mobile recovery form, token status, password form, session option.

## Interaksi dan validasi

Preserve identifier after generic response only if safe. Prevent duplicate resend. Keyboard
next/done correctly mapped.

## State wajib

Offline, timeout, expired link, password mismatch, success.

## Gooey Toast

Bottom-center safe-area + 16px. Result panel persistent.

## Accessibility

16px fields, error links, button labels explicit.

## Proposed source map

```text
apps/auth/src/features/recovery/pages/mobile-forgot-password-page.tsx
apps/auth/src/features/recovery/pages/mobile-reset-password-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
