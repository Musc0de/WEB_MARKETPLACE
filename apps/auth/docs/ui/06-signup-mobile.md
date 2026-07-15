# Signup — Mobile

## Tujuan

Membuat akun melalui form panjang yang tetap mudah dipahami.

## Route

`/signup`

## Komposisi

Satu kolom; section account details dan security dapat dipisah secara visual, bukan multi-step
wajib. Primary CTA full width. Requirement password ringkas/collapsible tetapi visible saat
diperlukan.

## Komponen utama

Mobile signup form, async username status, password meter, consent, verification result.

## Interaksi dan validasi

Keyboard next mengarah ke field berikutnya. Error tidak mereset data. Submit CTA mengikuti content,
bukan fixed bila menutupi keyboard.

## State wajib

Async availability, offline, server validation, verification resend cooldown.

## Gooey Toast

Bottom-center. Verification sent dapat menjadi success toast plus persistent result panel.

## Accessibility

Touch target, 16px inputs, requirements not color-only, clear terms link.

## Proposed source map

```text
apps/auth/src/features/signup/pages/mobile-signup-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
