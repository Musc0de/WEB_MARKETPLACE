# Admin Login — Desktop

## Tujuan

Mengautentikasi staff dengan trust, environment clarity, dan optional 2FA.

## Route

`/login`

## Komposisi

Centered card, admin branding, environment indicator, username/email according to admin auth policy,
password, 2FA step, forgot/recovery/help. No customer signup link.

## Komponen utama

Admin login form, 2FA form, device/session notice, security support link.

## Interaksi dan validasi

Generic credential error, rate limit, optional device challenge. Return only to validated admin
route.

## State wajib

Invalid, rate limited, 2FA required/invalid, account disabled, session created.

## Gooey Toast

Top-right; credential/2FA error inline. Success redirect immediately.

## Accessibility

Autocomplete, 2FA input semantics, focus, environment text.

## Proposed source map

```text
apps/admin/src/features/auth/pages/admin-login-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
