# Activation dan Verify Email — Desktop

## Tujuan

Memverifikasi token dan memungkinkan akun otomatis membuat username/password secara aman.

## Route

`/activate?token=...`, `/verify-email?token=...`

## Komposisi

Token processing panel. Activation form dapat meminta confirm email context, pilih/konfirmasi
username, password, confirm password. Result states: processing, invalid, expired, used, success.
Resend/support path tersedia.

## Komponen utama

Token status panel, activation form, password requirements, resend action, continue dashboard/shop.

## Interaksi dan validasi

Token tidak ditampilkan ulang di UI/log. Success creates session sesuai policy atau mengarahkan
login. Resend mempunyai cooldown.

## State wajib

Validating token, expired, invalid, already used, account already active, activation success, email
delivery pending.

## Gooey Toast

Success/error toast sebagai reinforcement; page result tetap sumber utama.

## Accessibility

Status heading focus, live region untuk token processing, form labels, resend timer text.

## Proposed source map

```text
apps/auth/src/features/activation/pages/activation-page.tsx
apps/auth/src/features/verification/pages/verify-email-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
