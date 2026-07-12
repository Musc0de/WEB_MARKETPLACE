# Minggu 7 — Worker, invoice, email, akun otomatis, notifications

## Arsitektur yang tidak boleh diubah

- `starsuperscare.net`: landing dan halaman informasi publik.
- `shop.starsuperscare.net`: products, product detail, category/search, cart, checkout, dan guest wishlist.
- `auth.starsuperscare.net`: login, signup, verifikasi, aktivasi, forgot/reset, dan logout.
- `dashboard.starsuperscare.net`: area client setelah login.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: operasi admin.
- `tracking.starsuperscare.net`: tracking publik dengan token opaque.
- `assets.starsuperscare.net`: target aset publik/CDN bila dipakai.
- `apps/worker`: proses internal; tidak mempunyai subdomain publik.

Cart dan checkout tidak dipindahkan ke dashboard. Database hanya boleh diakses oleh `apps/api` dan `apps/worker` melalui `packages/database`.

## Hari 31 — Transactional outbox worker, locking, retry, dan cleanup jobs

**Phase:** Worker, Invoice, Notification

**Baca sebelum mulai:**

- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement outbox poller dengan claim/lock aman, batch size, available_at, SKIP LOCKED atau strategi setara, correlation ID, dan graceful shutdown.
- **10:15–12:15:** Implement handler registry, idempotency/dedupe, exponential backoff with cap/jitter, max attempts, failed state/dead-letter semantics.
- **13:15–15:15:** Implement scheduled cleanup untuk expired session/token, release expired inventory reservation, dan stale guest cart policy.
- **15:30–17:30:** Tulis worker concurrency/retry/crash-recovery tests serta operational commands untuk inspect/retry failed job.

**Deliverables:**

- Outbox worker
- Retry/dead-letter semantics
- Cleanup jobs
- Worker tests/ops commands

**Acceptance criteria:**

- [ ] Dua worker tidak memproses row yang sama bersamaan
- [ ] Handler retry idempotent
- [ ] Failure tidak hilang diam-diam
- [ ] Reservation expired kembali tersedia

**File/folder utama yang diperkirakan berubah:**

- `apps/worker/src/outbox`
- `apps/worker/src/jobs`
- `apps/worker/tests`

**Command verifikasi minimum:**

```bash
deno task test:worker
deno task worker:once
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-31.md`

---

## Hari 32 — Invoice PDF, object storage, dan transactional email

**Phase:** Worker, Invoice, Notification

**Baca sebelum mulai:**

- `docs/09-email/EMAIL-AND-INVOICE.md`
- `packages/email/README.md`
- `docs/03-storefront/CHECKOUT.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement invoice number, immutable invoice data snapshot, PDF renderer, locale id-ID, integer amounts, and safe file naming.
- **10:15–12:15:** Upload invoice ke private object storage, simpan metadata, dan buat authenticated/signed download path dengan expiry.
- **13:15–15:15:** Implement EmailProvider interface, invoice/order/verification/reset/activation templates, delivery records, retry categories, and provider message ID.
- **15:30–17:30:** Hubungkan paid outbox ke invoice generation dan email; test PDF metadata, template rendering, provider failure/retry, and no public invoice leakage.

**Deliverables:**

- Invoice generator
- Private invoice storage
- Email provider abstraction/templates
- Paid-to-invoice-email job

**Acceptance criteria:**

- [ ] Invoice total sama dengan order snapshot
- [ ] Invoice tidak publik permanen
- [ ] Email failure dapat di-retry
- [ ] Template tidak memuat password

**File/folder utama yang diperkirakan berubah:**

- `apps/worker/src/jobs/invoice.ts`
- `packages/email/src`
- `apps/api/src/modules/invoices`
- `packages/contracts/src/invoice.ts`

**Command verifikasi minimum:**

```bash
deno task test:invoice
deno task test:email
deno task test:worker
deno task quality
```

**External gate:**

- Email transactional provider dan object storage credentials diperlukan untuk delivery nyata. Gunakan fake provider dalam test dan development tanpa mengklaim email terkirim.

**Prompt siap-tempel:** `../prompts/DAY-32.md`

---

## Hari 33 — Akun otomatis setelah guest payment dan claim order aman

**Phase:** Worker, Invoice, Notification

**Baca sebelum mulai:**

- `docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md`
- `docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement paid-order handler: bila guest email belum memiliki user, buat pending_activation user/profile dan activation token dalam transaksi idempotent.
- **10:15–12:15:** Bila email sudah terkait akun, jangan auto-link hanya dari input guest; buat secure claim/notification flow yang memverifikasi kepemilikan.
- **13:15–15:15:** Hubungkan activation UI/API ke pending order claim, username selection, password creation, verified email, session issue, dan redirect dashboard order.
- **15:30–17:30:** Tulis duplicate paid event, existing account, expired token, conflicting username, replay, and order-ownership tests.

**Deliverables:**

- Auto-account worker handler
- Secure order claim
- Activation-to-dashboard flow
- Provisioning tests

**Acceptance criteria:**

- [ ] Akun hanya dibuat setelah payment verified
- [ ] Tidak ada password via email
- [ ] Event ulang tidak membuat akun ganda
- [ ] Order tidak ditautkan ke akun salah

**File/folder utama yang diperkirakan berubah:**

- `apps/worker/src/jobs/provision-account.ts`
- `apps/api/src/modules/auth/order-claim.ts`
- `apps/auth/src/features/activation`

**Command verifikasi minimum:**

```bash
deno task test:auto-account
deno task test:auth
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-33.md`

---

## Hari 34 — Persistent notifications, read/unread API, dan SSE

**Phase:** Worker, Invoice, Notification

**Baca sebelum mulai:**

- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/04-dashboard/NOTIFICATIONS.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement notification creation handlers dari business outbox dengan dedupe_key, user ownership, type, data payload version, dan created_at.
- **10:15–12:15:** Implement list/pagination/unread-count/read/read-all endpoints; status hanya derived dari read_at.
- **13:15–15:15:** Implement authenticated SSE stream dengan heartbeat, reconnect guidance, bounded resources, last event cursor/refresh strategy, dan authorization.
- **15:30–17:30:** Tulis SSE/read tests termasuk disconnect/reconnect, unauthorized stream, duplicate events, and database-source-of-truth behavior.

**Deliverables:**

- Notification worker handlers
- Read/unread REST API
- Authenticated SSE
- Notification tests

**Acceptance criteria:**

- [ ] SSE bukan satu-satunya source
- [ ] User tidak menerima notifikasi user lain
- [ ] read_at konsisten
- [ ] Reconnect tidak menggandakan persistent records

**File/folder utama yang diperkirakan berubah:**

- `apps/worker/src/jobs/notifications.ts`
- `apps/api/src/modules/notifications`
- `apps/api/src/routes/v1/notifications.ts`

**Command verifikasi minimum:**

```bash
deno task test:notifications
deno task test:worker
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-34.md`

---

## Hari 35 — Commerce E2E, failure recovery, dan Integration Gate

**Phase:** Worker, Invoice, Notification

**Baca sebelum mulai:**

- `docs/10-testing/TEST-PLAN.md`
- `docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md`
- `docs/09-email/EMAIL-AND-INVOICE.md`

**Jadwal per jam:**

- **08:00–10:00:** Buat integration fixture end-to-end: product aktif, guest cart, checkout, order pending, verified payment, stock commit, stats, outbox, invoice, email record, account pending.
- **10:15–12:15:** Lanjutkan aktivasi, login, session, order ownership, notification, invoice access, dan digital entitlement bila item digital.
- **13:15–15:15:** Tambahkan failure matrix: price/stock change, expired reservation, duplicate/out-of-order webhook, worker crash/retry, email fail, expired activation.
- **15:30–17:30:** Jalankan seluruh integration suite dari database test bersih, perbaiki flakiness, dan tulis Integration Gate report.

**Deliverables:**

- Full commerce integration suite
- Failure/retry matrix
- Test fixtures
- Integration gate report

**Acceptance criteria:**

- [ ] Happy path berjalan tanpa manual DB edit
- [ ] Duplicate events tidak menggandakan side effect
- [ ] Failure dapat dipulihkan
- [ ] Test repeatable dari DB kosong

**File/folder utama yang diperkirakan berubah:**

- `quality/integration/commerce_flow_test.ts`
- `quality/fixtures`
- `docs/14-ai-build-playbook/progress/DAY-35-REPORT.md`

**Command verifikasi minimum:**

```bash
deno task test:integration
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-35.md`

---
