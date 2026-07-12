# Testing Strategy

## Unit

- Money/discount formatter.
- Sold calculation.
- Username/email normalization.
- Status transitions.
- Voucher rules.
- Permission checks.

## Integration

- Auth + session database.
- Guest cart merge.
- Checkout transaction.
- Inventory reservation/release.
- Payment webhook idempotency.
- Account auto-provisioning.
- Invoice/outbox creation.
- Refund dan sold decrement.

## E2E

- Guest membeli physical item.
- Guest membeli digital item lalu aktivasi akun/download.
- Existing user checkout.
- Login/logout/recovery.
- Dashboard order/history/invoice.
- Admin product/order/refund.

## Non-functional

- Accessibility keyboard/screen reader.
- Responsive mobile/tablet/desktop.
- Load product list/cart/SSE.
- Security tests untuk IDOR, CSRF, rate limit, upload, open redirect, webhook replay.
