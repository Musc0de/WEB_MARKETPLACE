# Notifications — Desktop

## Tujuan

Membaca event persisten dan mengelola read state tanpa kehilangan context.

## Route

`/notifications`

## Komposisi

Filter All/Unread/type, list-detail split bila lebar cukup, mark read/all, unread count.
Notification row: icon/type, title, description, timestamp, unread marker, destination.

## Komponen utama

Notification filters, list, detail pane, mark read, mark all, SSE connection status optional.

## Interaksi dan validasi

`read_at` menjadi sumber status. Opening dapat mark-read sesuai policy. SSE dedupe by notification
id. Reconnect fetches missed records via REST.

## State wajib

Loading, empty, no unread, SSE disconnected, partial failure, stale count.

## Gooey Toast

Realtime arrival may trigger top-right toast only for high-value event; record tetap masuk list.
Mark-read tidak perlu toast kecuali gagal.

## Accessibility

List item semantics, unread text not color-only, live announcement rate-limited, timestamp
accessible.

## Proposed source map

```text
apps/dashboard/src/features/notifications/pages/notifications-page.tsx
apps/dashboard/src/features/notifications/hooks/use-notification-stream.ts
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
