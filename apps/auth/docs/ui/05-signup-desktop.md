# Signup — Desktop

## Tujuan

Membuat akun dengan username, email, dan password yang valid tanpa informasi berlebihan.

## Route

`/signup`

## Komposisi

Card 500–560px. Field: full name bila diperlukan, username, email, password, confirm password, terms
consent. Password requirements tampil progresif. Login link jelas.

## Komponen utama

Signup form, username availability, password requirements, consent checkbox, submit, verification
sent panel.

## Interaksi dan validasi

Username availability debounced. Password requirements diperbarui tanpa mengumumkan setiap keystroke
secara berlebihan. Server validation dipetakan ke field. Setelah sukses, tampilkan verify-email
state.

## State wajib

Checking username, unavailable username, email used/generic policy, password invalid, terms missing,
verification pending.

## Gooey Toast

Success: email verification sent. Error: inline + summary; toast hanya summary singkat.

## Accessibility

`autocomplete=new-password`, requirement list accessible, checkbox label full sentence, focus first
error.

## Proposed source map

```text
apps/auth/src/features/signup/pages/signup-page.tsx
apps/auth/src/features/signup/components/signup-form.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
