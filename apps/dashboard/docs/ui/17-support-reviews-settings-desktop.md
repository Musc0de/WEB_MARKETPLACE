# Support, Reviews, dan Settings — Desktop

## Tujuan

Memberi self-service untuk bantuan, verified-purchase review, dan preference akun.

## Route

`/support/*`, `/reviews`, `/settings/*`

## Komposisi

Support: FAQ search + ticket list/detail split and composer. Reviews: pending review items, existing
reviews, edit/delete policy. Settings: section nav + notification/privacy/preferences forms.

## Komponen utama

FAQ search, ticket table/thread, composer/uploader, review form/list, settings forms/toggles.

## Interaksi dan validasi

Ticket can link order. Review only eligible item. Delete review confirmation. Settings saves per
section; unsaved changes guard.

## State wajib

No tickets, empty FAQ result, upload failure, review ineligible/moderation, settings conflict.

## Gooey Toast

Ticket sent, review saved/updated/deleted, settings saved. Errors inline + toast summary.

## Accessibility

Conversation semantics, attachment labels, rating accessible radio, toggle labels, focus after save.

## Proposed source map

```text
apps/dashboard/src/features/support/
apps/dashboard/src/features/reviews/
apps/dashboard/src/features/settings/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
