# Returns dan Refunds — Desktop

## Tujuan

Mengajukan retur berdasarkan eligible order item dan memantau keputusan/refund.

## Route

`/returns`, `/returns/{id}`, `/refunds`

## Komposisi

Return list + status filter. Create flow: select order/item, quantity, reason, explanation, evidence
upload, preferred resolution, review. Detail: timeline, messages, evidence, refund
amount/method/status.

## Komponen utama

Eligibility picker, item selector, reason form, uploader, review summary, return timeline, refund
breakdown.

## Interaksi dan validasi

Server determines eligibility/amount. Upload validates file. Submit idempotent. Cancel/edit only in
eligible state. Refund status not inferred from payment UI.

## State wajib

No eligible item, upload pending/failure, submitted, under review, approved/rejected, refund
pending/completed.

## Gooey Toast

Upload promise; submission success; validation/error inline; status update may generate
notification + toast.

## Accessibility

Form error summary, upload labels/progress, timeline, monetary breakdown clear.

## Proposed source map

```text
apps/dashboard/src/features/returns/
apps/dashboard/src/features/refunds/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
