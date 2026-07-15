# Support, Reviews, dan Settings — Mobile

## Tujuan

Mengelola bantuan dan preference melalui mobile-first lists/forms.

## Route

`/support/*`, `/reviews`, `/settings/*`

## Komposisi

FAQ/search first, tickets as cards, thread full-screen with composer anchored but keyboard-safe.
Reviews as item cards and full-page form. Settings as navigation list to individual forms.

## Komponen utama

Mobile ticket thread, composer, attachment picker, review form, settings list/forms.

## Interaksi dan validasi

Composer preserves draft. Rating control easy to touch. Settings save sticky only when necessary.
Back with unsaved change confirmation.

## State wajib

Empty, upload, keyboard, offline message queue decision, moderation status.

## Gooey Toast

Bottom-center above composer/sticky save/nav. Message send status also inline in thread.

## Accessibility

Keyboard-safe composer, message labels, rating names, settings headings.

## Proposed source map

```text
apps/dashboard/src/features/support/pages/mobile-ticket-page.tsx
apps/dashboard/src/features/reviews/pages/mobile-reviews-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
