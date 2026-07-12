# Minggu 10 — Testing, security, staging, production

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

## Hari 46 — Lengkapi unit/integration test, factories, dan coverage gate

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `docs/10-testing/TEST-PLAN.md`
- `docs/10-testing/TEST-PLAN.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Audit test coverage by domain and map every critical invariant/status transition
  to at least one test.
- **10:15–12:15:** Lengkapi unit tests price/discount/sold/cart merge/voucher/order total/token
  expiry/permission/status transition.
- **13:15–15:15:** Lengkapi integration tests
  auth/catalog/cart/reservation/payment/refund/outbox/invoice/notification/support menggunakan
  isolated test DB/branch.
- **15:30–17:30:** Stabilkan factories, time/random/provider fakes, parallelization policy, coverage
  report, and fail threshold.

**Deliverables:**

- Critical unit coverage
- Integration coverage
- Deterministic factories/fakes
- Coverage gate

**Acceptance criteria:**

- [ ] Tidak ada test bergantung urutan
- [ ] External provider dipalsukan deterministik
- [ ] Critical invariants covered
- [ ] Suite repeatable

**File/folder utama yang diperkirakan berubah:**

- `quality/unit`
- `quality/integration`
- `quality/fixtures`
- `deno.jsonc`

**Command verifikasi minimum:**

```bash
deno task test:unit
deno task test:integration
deno task test:coverage
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-46.md`

---

## Hari 47 — E2E browser, accessibility, responsive, dan failure journeys

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `docs/10-testing/TEST-PLAN.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Set up E2E runner and isolated environment; seed deterministic
  user/products/payment mock and launch all required apps.
- **10:15–12:15:** Automate guest product→cart→checkout→paid→invoice/account
  activation→login→dashboard order journey.
- **13:15–15:15:** Automate signup/login/recovery, cart merge, wishlist, history pagination,
  notification reconnect, return, support, admin operations, and public tracking.
- **15:30–17:30:** Run accessibility keyboard/focus/labels/contrast checks and desktop/mobile
  viewport suite; capture artifacts on failure.

**Deliverables:**

- Core E2E suite
- Failure journey tests
- Accessibility checks
- Responsive tests

**Acceptance criteria:**

- [ ] Core purchase path tested in browser
- [ ] No test uses production secrets
- [ ] Failure artifacts retained
- [ ] Keyboard-only critical flows usable

**File/folder utama yang diperkirakan berubah:**

- `quality/e2e`
- `quality/e2e/config`
- `scripts/start-test-stack.ts`

**Command verifikasi minimum:**

```bash
deno task test:e2e
deno task test:a11y
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-47.md`

---

## Hari 48 — Security, observability, backup/restore, dan operational runbooks

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `docs/08-security/SECURITY-CHECKLIST.md`
- `docs/11-deployment/DENO-DEPLOY-NEON.md`
- `docs/08-security/SECURITY-CHECKLIST.md`
- `docs/11-deployment/DENO-DEPLOY-NEON.md`

**Jadwal per jam:**

- **08:00–10:00:** Threat-model auth/payment/upload/IDOR/webhook/SSE/tracking/admin; remediate high
  risks, headers, CSRF, CORS, rate limit, validation, and authorization.
- **10:15–12:15:** Audit dependency/secrets/log redaction, cookie flags, token handling, upload
  controls, CSP, and production error responses.
- **13:15–15:15:** Implement structured logs, health/readiness, metrics/alerts for errors, latency,
  webhook failures, email failures, outbox backlog, and stock anomalies.
- **15:30–17:30:** Document and rehearse Neon backup/restore or branch-based recovery, migration
  rollback/forward, incident response, and provider outage runbooks.

**Deliverables:**

- Threat model/remediation
- Observability and alerts
- Backup/restore rehearsal
- Operational runbooks

**Acceptance criteria:**

- [ ] No known high-severity finding open
- [ ] Secrets absent from logs/repo
- [ ] Restore exercise evidenced
- [ ] Critical alerts have owner/action

**File/folder utama yang diperkirakan berubah:**

- `docs/security/THREAT-MODEL.md`
- `docs/runbooks`
- `apps/api/src/observability`
- `apps/worker/src/observability`

**Command verifikasi minimum:**

```bash
deno task audit
deno task test:security
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-48.md`

---

## Hari 49 — Deploy staging, migration rehearsal, DNS/CORS/cookie validation, dan UAT

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `docs/11-deployment/DENO-DEPLOY-NEON.md`
- `.env.example`
- `docs/01-architecture/SUBDOMAINS-AND-ROUTES.md`
- `IMPLEMENTATION-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Create staging environment matrix, deployment configs for each existing app,
  secret injection, build commands, and Neon staging branch.
- **10:15–12:15:** Run migration rehearsal from production-like snapshot, deploy API/worker first
  then frontends, and verify health/readiness.
- **13:15–15:15:** Configure only documented DNS hosts, HTTPS, CORS allowlist, API host-only secure
  session cookie, CSP, object storage, payment/email/shipping webhooks.
- **15:30–17:30:** Run staging smoke/E2E/UAT, capture defects, fix release blockers, freeze release
  candidate, and document rollback.

**Deliverables:**

- Staging deployments
- Migration rehearsal
- DNS/security validation
- Signed UAT/release candidate

**Acceptance criteria:**

- [ ] No architecture/domain drift
- [ ] Staging uses non-production DB/provider credentials
- [ ] All canonical URLs work
- [ ] Rollback steps tested/documented

**File/folder utama yang diperkirakan berubah:**

- `infrastructure/deploy`
- `docs/releases/RC-1.md`
- `docs/runbooks/rollback.md`

**Command verifikasi minimum:**

```bash
deno task build
deno task test:smoke:staging
deno task quality
```

**External gate:**

- Deployment platform, DNS access, Neon staging, email/payment/storage/shipping sandbox credentials
  diperlukan untuk UAT penuh.

**Prompt siap-tempel:** `../prompts/DAY-49.md`

---

## Hari 50 — Production release, smoke test, rollback readiness, dan handover

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `IMPLEMENTATION-CHECKLIST.md`
- `docs/11-deployment/DENO-DEPLOY-NEON.md`
- `IMPLEMENTATION-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Review release diff, dependency lock, secrets, database migration, backup/restore
  point, feature flags, provider production settings, and change approval.
- **10:15–12:15:** Run production migration with logs, deploy API and worker, verify health, then
  deploy storefront/auth/dashboard/admin/tracking and public site as applicable.
- **13:15–15:15:** Run production smoke: login, products, cart, provider-approved controlled payment
  verification, webhook, invoice, email, activation, dashboard, admin, tracking, notification.
  Jangan memakai sandbox credential pada production.
- **15:30–17:30:** Monitor errors/latency/outbox/webhooks/email, execute rollback if thresholds
  breached, finalize release notes, handover docs, and 24-hour observation checklist.

**Deliverables:**

- Production release
- Smoke evidence
- Rollback readiness
- Final handover and post-launch checklist

**Acceptance criteria:**

- [ ] Migration/deploy evidence tersimpan
- [ ] Critical smoke checks pass
- [ ] Monitoring aktif
- [ ] Known limitations documented with owners

**File/folder utama yang diperkirakan berubah:**

- `docs/releases/PRODUCTION-1.0.0.md`
- `docs/operations/HANDOVER.md`
- `docs/operations/POST-LAUNCH-CHECKLIST.md`

**Command verifikasi minimum:**

```bash
deno task quality
deno task build
deno task test:smoke:production
```

**External gate:**

- Production credentials dan explicit change approval diperlukan. Jangan pernah menguji transaksi
  riil tanpa prosedur pembayaran aman yang disetujui.

**Prompt siap-tempel:** `../prompts/DAY-50.md`

---
