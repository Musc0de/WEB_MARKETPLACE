# Public Tracking — Mobile

## Tujuan

Melihat tracking cepat dari link SMS/email pada ponsel.

## Route

`/`, `/track/{token}`

## Komposisi

Compact header, search/form, status card, vertical timeline, support CTA. Content single column and
safe-area.

## Komponen utama

Mobile tracking form, summary card, timeline, refresh control.

## Interaksi dan validasi

Deep link loads directly. Pull-to-refresh optional but visible Refresh button remains. Long tracking
codes wrap/copy safely.

## State wajib

Loading, invalid, delayed, delivered, offline.

## Gooey Toast

Bottom-center safe-area + 16px; no bottom navigation.

## Accessibility

44px controls, timeline readable, copy action labeled.

## Proposed source map

```text
apps/tracking/src/pages/mobile-tracking-result-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
