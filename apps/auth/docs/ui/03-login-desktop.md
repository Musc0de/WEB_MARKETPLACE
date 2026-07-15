# Login — Desktop

## Tujuan

Memasukkan username dan password, memulihkan session, lalu kembali ke tujuan yang aman.

## Route

`/login`

## Komposisi

Auth card: title, username field, password field + visibility, remember/session wording sesuai
policy, forgot password link, primary Login, signup link. Optional security message bila login
attempt rate-limited.

## Komponen utama

Username input, password input, reveal button, submit button, forgot link, signup link, error
summary.

## Interaksi dan validasi

Submit dengan Enter. Disable duplicate submit. Generic invalid credential message. Successful login
fetches session and redirects to validated return_to/dashboard.

## State wajib

Idle, validating, submitting, invalid credential, rate limited, account inactive, session
established, server unavailable.

## Gooey Toast

Promise toast boleh dipakai untuk short login request, tetapi invalid credential harus inline.
Success toast singkat dan redirect langsung.

## Accessibility

`autocomplete=username/current-password`, focus error summary, reveal button state announced.

## Proposed source map

```text
apps/auth/src/features/login/pages/login-page.tsx
apps/auth/src/features/login/components/login-form.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
