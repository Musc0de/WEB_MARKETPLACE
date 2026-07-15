# Public Tracking — Desktop

## Tujuan

Memeriksa status shipment tanpa login dengan privacy yang memadai.

## Route

`tracking.starsuperscare.net/`, `/track/{token}`

## Komposisi

Centered tracking search card. Result layout: shipment summary left/top, vertical timeline, delivery
estimate, support/info. Branding minimal dan link ke shop/dashboard.

## Komponen utama

Tracking form, result summary, timeline, courier info, support CTA.

## Interaksi dan validasi

Token entry validates format locally but server determines validity. Refresh status manual/periodic
with timestamp. Do not expose full address/email.

## State wajib

Initial, loading, invalid/expired, not yet shipped, delivered, delayed, provider unavailable.

## Gooey Toast

Top-right. Refresh success generally no toast; error may toast + inline status.

## Accessibility

Form label, timeline ordered list, status text, privacy-safe content.

## Proposed source map

```text
apps/tracking/src/pages/tracking-home-page.tsx
apps/tracking/src/pages/tracking-result-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
