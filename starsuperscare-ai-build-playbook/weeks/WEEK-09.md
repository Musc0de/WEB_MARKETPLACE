# Minggu 9 — Returns, support, admin operations, tracking

## Arsitektur yang tidak boleh diubah

- `starsuperscare.net`: landing dan halaman informasi publik.
- `shop.starsuperscare.net`: products, product detail, category/search, cart, checkout, dan guest
  wishlist.
- `auth.starsuperscare.net`: login, signup, verifikasi, aktivasi, forgot/reset, dan logout.
- `dashboard.starsuperscare.net`: area client setelah login.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: operasi admin.
- `tracking.starsuperscare.net`: tracking publik dengan token opaque.
- `assets.starsuperscare.net`: target aset publik/CDN bila dipakai.
- `apps/worker`: proses internal; tidak mempunyai subdomain publik.

Cart dan checkout tidak dipindahkan ke dashboard. Database hanya boleh diakses oleh `apps/api` dan
`apps/worker` melalui `packages/database`.

## Hari 41 — Returns dan refunds end-to-end

**Phase:** Operasional dan purnajual

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/06-database/SCHEMA.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement return eligibility policy by order item/status/window, create request,
  reason, quantity, evidence metadata, communication history.
- **10:15–12:15:** Implement dashboard returns/refunds list/detail/form/upload flow dan user
  ownership.
- **13:15–15:15:** Implement admin review/approve/reject/receive/refund actions dengan permission,
  provider refund adapter, audit, and idempotency.
- **15:30–17:30:** Update finalized refund to refunded_sold/net_sold and optional restock decision;
  test partial/full/duplicate/refund-failure cases.

**Deliverables:**

- Return API/dashboard
- Admin return workflow
- Refund adapter/state machine
- Sold correction tests

**Acceptance criteria:**

- [ ] Refund tidak otomatis restock tanpa keputusan
- [ ] Partial refund amount bounded
- [ ] net_sold corrected once
- [ ] Evidence private and validated

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/returns`
- `apps/api/src/modules/refunds`
- `apps/dashboard/src/features/returns`
- `apps/admin/src/features/returns`

**Command verifikasi minimum:**

```bash
deno task test:returns
deno task test:refunds
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-41.md`

---

## Hari 42 — Support FAQ, tickets, messages, dan attachments

**Phase:** Operasional dan purnajual

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement public/account FAQ read model and support ticket create/list/detail
  with category, order link validation, priority/status, and ownership.
- **10:15–12:15:** Implement ticket message thread and private attachment upload/download with
  MIME/size/authorization rules.
- **13:15–15:15:** Bangun dashboard support UI dan admin queue/detail/reply/assign/status workflow
  dengan notifications/outbox.
- **15:30–17:30:** Tulis IDOR, attachment, spam/rate-limit, closed-ticket, and notification tests.

**Deliverables:**

- FAQ/ticket API
- Dashboard support center
- Admin support queue
- Attachment security tests

**Acceptance criteria:**

- [ ] Order link hanya bila milik user
- [ ] Attachment tidak publik
- [ ] Admin actions diaudit
- [ ] Ticket notification idempotent

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/support`
- `apps/dashboard/src/features/support`
- `apps/admin/src/features/support`

**Command verifikasi minimum:**

```bash
deno task test:support
deno task build:dashboard
deno task build:admin
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-42.md`

---

## Hari 43 — Admin orders, payments, invoices, dan customers

**Phase:** Operasional dan purnajual

**Baca sebelum mulai:**

- `apps/admin/README.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/08-security/SECURITY-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement admin order list/detail filters, status timeline, customer snapshot,
  items, totals, payment, shipment, invoice, and support links.
- **10:15–12:15:** Implement permitted operations: mark processing, attach shipment, cancel rules,
  resend invoice, retry job, without editing immutable financial snapshot arbitrarily.
- **13:15–15:15:** Implement payment events/invoice/customer list/detail with least-privilege data
  masking and no password/session secret exposure.
- **15:30–17:30:** Bangun admin UI, audit all state changes, and authorization/status-transition
  tests.

**Deliverables:**

- Admin order operations
- Payment/invoice views
- Customer operations
- Audit/authorization tests

**Acceptance criteria:**

- [ ] Status transitions validated server-side
- [ ] Sensitive data masked
- [ ] Financial snapshot not silently editable
- [ ] Every action has actor/audit

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/admin/orders`
- `apps/admin/src/features/orders`
- `apps/admin/src/features/customers`
- `apps/admin/src/features/payments`

**Command verifikasi minimum:**

```bash
deno task test:admin-api
deno task test:admin
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-43.md`

---

## Hari 44 — Admin review moderation, inventory operations, audit, dan operational dashboard

**Phase:** Operasional dan purnajual

**Baca sebelum mulai:**

- `apps/admin/README.md`
- `docs/08-security/SECURITY-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement review moderation queue with publish/reject policy, reason, audit, and
  aggregate recalculation.
- **10:15–12:15:** Complete admin catalog/inventory operations including low stock, movement
  history, product status, and bulk action safeguards.
- **13:15–15:15:** Build operational dashboard cards for orders/payments/outbox/email/low-stock
  using bounded queries and permission-aware metrics.
- **15:30–17:30:** Build audit log viewer with filters/redaction, test admin boundaries, and
  responsive admin build.

**Deliverables:**

- Review moderation
- Inventory operations
- Operational metrics
- Audit log viewer

**Acceptance criteria:**

- [ ] Moderation does not edit review content silently
- [ ] Bulk actions require explicit selection/confirmation
- [ ] Metrics do not leak PII
- [ ] Audit immutable to normal admin

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/admin/reviews`
- `apps/admin/src/features/reviews`
- `apps/admin/src/features/overview`
- `apps/admin/src/features/audit`

**Command verifikasi minimum:**

```bash
deno task test:admin
deno task build:admin
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-44.md`

---

## Hari 45 — Public tracking, shipment events, dan Operations Gate

**Phase:** Operasional dan purnajual

**Baca sebelum mulai:**

- `docs/01-architecture/SUBDOMAINS-AND-ROUTES.md`
- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`
- `docs/01-architecture/SUBDOMAINS-AND-ROUTES.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement opaque public tracking token issue/revoke/expiry and endpoint
  projection that exposes only safe shipment/order fields.
- **10:15–12:15:** Implement shipment provider adapter/webhook or deterministic mock, unique event
  handling, timeline ordering, and order notification outbox.
- **13:15–15:15:** Bangun tracking app with token route, invalid/expired/not-found states, timeline,
  estimated delivery, and no account PII.
- **15:30–17:30:** Run operations integration tests, security review tracking enumeration, build
  admin/dashboard/tracking, and write Operations Gate report.

**Deliverables:**

- Public tracking token/API
- Shipment event adapter
- Tracking frontend
- Operations gate report

**Acceptance criteria:**

- [ ] Order ID mentah bukan public credential
- [ ] Token sulit ditebak dan revocable
- [ ] Payload tidak memuat email/alamat lengkap
- [ ] Duplicate shipping event idempotent

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/tracking`
- `apps/api/src/modules/shipping/webhook.ts`
- `apps/tracking/src`

**Command verifikasi minimum:**

```bash
deno task test:tracking
deno task build:tracking
deno task quality
```

**External gate:**

- Real courier integration dapat mengganti mock adapter setelah akun provider dan webhook secret
  tersedia.

**Prompt siap-tempel:** `../prompts/DAY-45.md`

---
