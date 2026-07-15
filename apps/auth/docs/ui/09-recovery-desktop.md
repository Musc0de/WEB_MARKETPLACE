# Forgot dan Reset Password — Desktop

## Tujuan

Memulai recovery tanpa account enumeration dan menetapkan password baru secara aman.

## Route

`/forgot-password`, `/reset-password?token=...`

## Komposisi

Forgot form meminta username atau email sesuai policy; response selalu generic. Reset page
memvalidasi token lalu meminta password baru dan confirmation. Tampilkan option logout all sessions
bila policy mendukung.

## Komponen utama

Recovery form, generic sent panel, reset form, password requirements, token status.

## Interaksi dan validasi

Resend cooldown. Reset invalidates token and relevant sessions according to policy. After success
direct to login or establish session explicitly.

## State wajib

Submitting, generic sent, token expired/invalid/used, password rejected, reset success.

## Gooey Toast

Request accepted: info/success generic. Reset success: success. Field error inline.

## Accessibility

No account enumeration in copy, autocomplete new-password, focus result heading.

## Proposed source map

```text
apps/auth/src/features/recovery/pages/forgot-password-page.tsx
apps/auth/src/features/recovery/pages/reset-password-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
