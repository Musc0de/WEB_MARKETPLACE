# Login — Mobile

## Tujuan

Melakukan login tanpa layout shift atau keyboard obstruction.

## Route

`/login`

## Komposisi

Satu kolom; form dekat bagian atas tetapi memiliki breathing room. CTA full width. Secondary links
ditumpuk dengan jarak cukup. Brand visual sederhana.

## Komponen utama

Mobile login form, keyboard-aware scroll container, password reveal, full-width CTA.

## Interaksi dan validasi

Scroll ke error field. Submit via keyboard action `go`. Preserve username setelah invalid; password
handling mengikuti security decision.

## State wajib

Keyboard, weak network, invalid, rate limited, session expired return flow.

## Gooey Toast

Bottom-center. Jangan menutupi password manager prompt atau submit CTA.

## Accessibility

16px input, 44px controls, no hover dependency, live status tidak berulang.

## Proposed source map

```text
apps/auth/src/features/login/pages/mobile-login-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
