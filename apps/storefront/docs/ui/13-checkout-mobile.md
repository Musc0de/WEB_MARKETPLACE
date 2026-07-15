# Checkout — Mobile

## Tujuan

Menyelesaikan checkout dengan satu langkah per layar dan CTA stabil.

## Route

`/checkout/*`

## Komposisi

Compact step indicator. Satu kolom. Order summary collapsible tetapi total selalu terlihat. Sticky
Continue/Pay CTA. Address/shipping/payment selection memakai cards atau sheets. Success page
prioritizes order number, status, email, activation, dan dashboard link.

## Komponen utama

Mobile step header, collapsible summary, address card, method cards, sticky CTA, payment status
panel.

## Interaksi dan validasi

Scroll ke error pertama. Keyboard tidak menutupi CTA. Back gesture/browser back tidak menghilangkan
draft. Payment button hanya satu kali aktif sampai response/idempotency resolved.

## State wajib

Quote loading, unavailable shipping, payment app return, network interruption, pending verification,
success.

## Gooey Toast

Bottom-center di atas sticky CTA. Hindari toast saat external payment screen; tampilkan status
ketika kembali.

## Accessibility

Form input 16px, radio card semantics, sticky CTA 48px+, summary accordion announced.

## Proposed source map

```text
apps/storefront/src/features/checkout/layouts/mobile-checkout-layout.tsx
apps/storefront/src/features/checkout/components/mobile-checkout-footer.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
