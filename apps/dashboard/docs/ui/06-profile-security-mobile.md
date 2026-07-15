# Profile dan Security — Mobile

## Tujuan

Mengelola akun melalui satu kolom dan section yang mudah dipindai.

## Route

`/profile`, `/profile/security`

## Komposisi

Profile summary di atas, edit form satu kolom. Security section menjadi list destination atau
accordion; active session sebagai cards. Save CTA dapat sticky jika form panjang.

## Komponen utama

Mobile profile form, avatar picker, session cards, change password form, sticky save.

## Interaksi dan validasi

Keyboard-safe save. Reauth sheet/modal. Logout all confirmation menyebut dampak.

## State wajib

Upload, validation, keyboard, session list loading, revoked current session redirect.

## Gooey Toast

Bottom-center above sticky save/nav. Password success tetap menghasilkan security notification.

## Accessibility

Touch target, camera/gallery control labels, error summary, safe-area.

## Proposed source map

```text
apps/dashboard/src/features/profile/pages/mobile-profile-page.tsx
apps/dashboard/src/features/security/pages/mobile-security-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
