# Returns dan Refunds — Mobile

## Tujuan

Mengajukan retur melalui step-by-step mobile flow dan memantau status.

## Route

`/returns`, `/returns/{id}`, `/refunds`

## Komposisi

Return cards; create flow satu step per section atau compact stepper. Evidence upload dari
camera/gallery/file. Sticky Continue/Submit. Detail timeline vertical, refund amount prominent.

## Komponen utama

Mobile return stepper, item cards, uploader, sticky CTA, timeline, message thread.

## Interaksi dan validasi

Preserve draft; camera permission error handled. Sticky CTA disabled with explanation. Submit
confirmation includes items/quantity.

## State wajib

No eligible, upload, offline, draft, pending, approved/rejected, refund delayed.

## Gooey Toast

Bottom-center above sticky CTA/nav. Upload result can use promise toast; final state remains on
page.

## Accessibility

Touch targets, image evidence alt/filename, progress text, focus per step.

## Proposed source map

```text
apps/dashboard/src/features/returns/pages/mobile-return-create-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
