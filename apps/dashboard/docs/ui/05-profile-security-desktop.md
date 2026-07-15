# Profile dan Security — Desktop

## Tujuan

Mengelola data akun, password, session, dan optional 2FA tanpa menampilkan secret.

## Route

`/profile`, `/profile/security`, `/settings/profile`, `/settings/security`

## Komposisi

Settings-style two-column navigation + form panel. Profile fields, avatar, contact data. Security:
change password, active sessions table, logout all, login history, optional 2FA setup.

## Komponen utama

Profile form, avatar uploader, password form, session table, revoke dialog, 2FA panel.

## Interaksi dan validasi

Unsaved changes warning. Sensitive changes may require re-auth. Avatar upload validates type/size.
Session revoke shows current device guard.

## State wajib

Loading, validation, upload progress/error, reauth required, session revoke pending, no login
history.

## Gooey Toast

Save profile/password success; upload promise; revoke success/error. Validation inline.

## Accessibility

Labels, crop controls accessible, current session identified textually, modal focus trap.

## Proposed source map

```text
apps/dashboard/src/features/profile/
apps/dashboard/src/features/security/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
