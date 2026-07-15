# Admin Customers, Support, dan Reviews — Desktop

## Tujuan

Mengelola customer context, support queue, dan moderation dengan privacy/permission boundaries.

## Route

`/customers`, `/support`, `/reviews`

## Komposisi

Customer table/detail with orders, addresses masked as appropriate, sessions/security actions
guarded. Support queue list-detail with SLA/status/assignee. Review moderation table with content,
purchase verification, approve/reject reason.

## Komponen utama

Customer table/profile, support queue/thread, assignment/status actions, review moderation, audit
drawer.

## Interaksi dan validasi

PII access logged. Impersonation if ever supported requires explicit policy/banner/audit. Support
messages and moderation actions validated. Bulk moderation limited.

## State wajib

No result, restricted PII, ticket queue, attachment error, moderation conflict.

## Gooey Toast

Assignment/status/reply/moderation result; batch summary. Persistent audit remains.

## Accessibility

Privacy labels, conversation semantics, moderation reason, permission denied state.

## Proposed source map

```text
apps/admin/src/features/customers/
apps/admin/src/features/support/
apps/admin/src/features/reviews/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
