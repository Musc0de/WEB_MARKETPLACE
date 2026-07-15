# Notifications — Mobile

## Tujuan

Menyediakan notification inbox ringan dan aman dari spam toast.

## Route

`/notifications`

## Komposisi

Segment All/Unread, stacked list, compact action header. Detail dapat membuka destination langsung
atau route detail. Swipe action optional; visible menu tetap ada.

## Komponen utama

Mobile notification list, unread badge, filter sheet/segments, connection banner.

## Interaksi dan validasi

Mark read optimistic with rollback. New notification inserted without jumping scroll; show small
new-items indicator.

## State wajib

Empty, no unread, reconnecting, offline, load more.

## Gooey Toast

Bottom-center above nav. Maksimal satu realtime toast; queue/dedupe. Notification page itself tidak
menampilkan toast untuk setiap item.

## Accessibility

Readable timestamps, markers labeled, list update does not steal focus.

## Proposed source map

```text
apps/dashboard/src/features/notifications/pages/mobile-notifications-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
