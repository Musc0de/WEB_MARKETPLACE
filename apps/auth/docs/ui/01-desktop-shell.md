# Auth Desktop Shell

## Tujuan

Memberikan konteks terpercaya dan fokus tinggi untuk authentication.

## Route

`auth.starsuperscare.net/*`

## Komposisi

Centered card 440–520px pada layar standar atau split layout pada layar lebar. Logo, title,
supporting text, form, primary CTA, secondary link, legal links. Illustration/testimonial hanya bila
tidak mengurangi performa dan fokus.

## Komponen utama

Auth layout, brand header, auth card, security note, support/legal links, responsive toaster.

## Interaksi dan validasi

Route transition mempertahankan `return_to`. Jangan tampilkan full storefront mega navigation. Link
kembali ke shop tersedia.

## State wajib

Session checking, route token loading, expired token, service unavailable.

## Gooey Toast

Desktop top-right, offset 24px/80px. Credential error tetap inline. Redirect success tidak menunggu
toast selesai.

## Accessibility

Main landmark, H1 per page, form labels, skip animation on reduced motion.

## Proposed source map

```text
apps/auth/src/layouts/auth-layout.tsx
apps/auth/src/components/auth-card.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
