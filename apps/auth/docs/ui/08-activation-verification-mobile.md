# Activation dan Verify Email — Mobile

## Tujuan

Menyelesaikan activation dari link email pada ponsel dengan state yang jelas.

## Route

`/activate`, `/verify-email`

## Komposisi

Single card/panel. Result icon kecil, heading, explanation, form bila token valid, full-width CTA.
Support/resend berada di bawah.

## Komponen utama

Mobile token status, activation form, password reveal, resend cooldown.

## Interaksi dan validasi

Deep link membuka app route dan mempertahankan token hanya di URL processing layer. Jangan copy
token ke visible field.

## State wajib

Same token states, app reopened, expired link, weak network.

## Gooey Toast

Bottom-center, tetapi persistent result panel selalu ada.

## Accessibility

Large CTA, clear focus, avoid celebratory motion under reduced-motion.

## Proposed source map

```text
apps/auth/src/features/activation/pages/mobile-activation-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
