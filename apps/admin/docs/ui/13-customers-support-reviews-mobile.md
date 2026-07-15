# Admin Customers, Support, dan Reviews — Mobile

## Tujuan

Mendukung customer lookup, ticket reply, dan moderation ringan.

## Route

`/customers`, `/support`, `/reviews`

## Komposisi

Customer cards and limited detail. Support queue cards, thread full-screen, keyboard-safe composer.
Review cards with approve/reject action sheet.

## Komponen utama

Search, customer cards, ticket thread, composer, moderation cards/action sheet.

## Interaksi dan validasi

Sensitive information collapsed/masked. Reply draft preserved. Reject requires reason. Bulk action
unavailable.

## State wajib

Permission, offline, upload, conflict, desktop-required.

## Gooey Toast

Bottom-center above composer/sticky action. Send status also inline.

## Accessibility

Touch targets, privacy, message labels, modal focus.

## Proposed source map

```text
apps/admin/src/features/support/pages/mobile-admin-ticket-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
