# Minggu 3 — API baseline dan autentikasi

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

## Hari 11 — Lengkapi API conventions, validation, CORS, CSRF, rate limit, dan RBAC context

**Phase:** API dan Auth

**Baca sebelum mulai:**

- `docs/05-api/ENDPOINTS.md`
- `docs/05-api/ERROR-CONTRACT.md`
- `docs/08-security/SECURITY-CHECKLIST.md`
- `docs/05-api/ERROR-CONTRACT.md`

**Jadwal per jam:**

- **08:00–10:00:** Buat route modules, dependency injection/context, typed success/error response,
  request parsing, pagination envelope, dan request ID propagation.
- **10:15–12:15:** Implement Zod validation middleware, sanitized errors, security headers, explicit
  CORS origin allowlist, dan credential handling.
- **13:15–15:15:** Implement CSRF strategy untuk state-changing cookie-auth requests, rate limiter
  interface/storage, dan trusted proxy configuration.
- **15:30–17:30:** Implement session loader dan RBAC/permission guard skeleton; tulis middleware
  tests termasuk origin, CSRF, dan error cases.

**Deliverables:**

- API conventions
- Validation/error middleware
- CORS/CSRF/rate limit
- Session/RBAC context

**Acceptance criteria:**

- [ ] Origin wildcard tidak dipakai dengan credentials
- [ ] State-changing request terlindungi CSRF
- [ ] Validation error konsisten
- [ ] Permission default-deny

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/middleware`
- `apps/api/src/http`
- `packages/contracts/src/http.ts`
- `apps/api/tests/middleware_test.ts`

**Command verifikasi minimum:**

```bash
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-11.md`

---

## Hari 12 — Signup, password hashing, dan verifikasi email

**Phase:** API dan Auth

**Baca sebelum mulai:**

- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/05-api/ENDPOINTS.md`
- `packages/auth/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement password policy dan Argon2id wrapper yang dapat diuji, constant-time
  comparison semantics, serta secure random token helpers.
- **10:15–12:15:** Implement POST /v1/auth/signup dengan transaction user/profile/credential,
  normalized identity, status pending_verification, dan audit event.
- **13:15–15:15:** Implement verification token issuance, resend throttling, POST /verify-email,
  token rotation/revocation, dan outbox email event.
- **15:30–17:30:** Tulis unit/integration tests untuk duplicate username/email, invalid input, token
  expiry/reuse, rollback, dan generic responses.

**Deliverables:**

- Secure password module
- Signup API
- Email verification API
- Auth tests

**Acceptance criteria:**

- [ ] Password tidak pernah dilog
- [ ] Token plaintext hanya tampil saat dibuat untuk dikirim
- [ ] Signup transactional
- [ ] Verification token one-time

**File/folder utama yang diperkirakan berubah:**

- `packages/auth/src/password.ts`
- `packages/auth/src/tokens.ts`
- `apps/api/src/modules/auth/signup.ts`
- `apps/api/src/routes/v1/auth.ts`

**Command verifikasi minimum:**

```bash
deno task test:auth
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-12.md`

---

## Hari 13 — Login username/password, session, logout, dan audit

**Phase:** API dan Auth

**Baca sebelum mulai:**

- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/08-security/SECURITY-CHECKLIST.md`
- `packages/auth/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement POST /auth/login dengan username normalized, generic credential error,
  throttling, account-status checks, dan audit login.
- **10:15–12:15:** Implement opaque session ID, database digest, expiry/idle timeout, rotation,
  Secure HttpOnly host-only cookie pada API, dan GET /session.
- **13:15–15:15:** Implement logout current, logout-all, session listing/revocation primitives,
  serta cleanup query untuk worker.
- **15:30–17:30:** Tulis tests untuk valid/invalid login, lock/rate limit, cookie flags, session
  rotation, revoked/expired session, dan cross-origin credential flow.

**Deliverables:**

- Login API
- Session lifecycle
- Logout/logout-all
- Login audit and tests

**Acceptance criteria:**

- [ ] Cookie tidak dapat dibaca JavaScript
- [ ] Session ID tidak disimpan plaintext
- [ ] Pesan login tidak melakukan user enumeration
- [ ] Revoked session langsung ditolak

**File/folder utama yang diperkirakan berubah:**

- `packages/auth/src/session.ts`
- `apps/api/src/modules/auth/login.ts`
- `apps/api/src/modules/auth/session.ts`
- `apps/api/tests/auth_session_test.ts`

**Command verifikasi minimum:**

```bash
deno task test:auth
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-13.md`

---

## Hari 14 — Forgot/reset password, activation, dan return_to allowlist

**Phase:** API dan Auth

**Baca sebelum mulai:**

- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md`
- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement forgot-password generic response, reset token issuance, expiry/reuse
  prevention, password replacement, dan optional revoke-all sessions.
- **10:15–12:15:** Implement account activation endpoint untuk pending guest account: token
  verification, username final, password creation, email verification, dan activation audit.
- **13:15–15:15:** Implement return_to parser dengan allowlist host/path, anti-open-redirect, dan
  safe default dashboard home.
- **15:30–17:30:** Tulis integration tests untuk expired/reused token, reset unknown email,
  activation conflict, session revocation, dan malicious return_to.

**Deliverables:**

- Password recovery API
- Account activation API
- Safe return_to
- Recovery/activation tests

**Acceptance criteria:**

- [ ] Response forgot password tetap generik
- [ ] Aktivasi tidak mengirim password
- [ ] Token one-time dan hashed
- [ ] Open redirect ditolak

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/auth/recovery.ts`
- `apps/api/src/modules/auth/activation.ts`
- `packages/auth/src/return-to.ts`

**Command verifikasi minimum:**

```bash
deno task test:auth
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-14.md`

---

## Hari 15 — Bangun aplikasi auth dan selesaikan Auth Gate

**Phase:** API dan Auth

**Baca sebelum mulai:**

- `apps/auth/README.md`
- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md`
- `docs/07-ui/GOOEY-TOAST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun API client dengan credentials, CSRF bootstrap, typed errors,
  loading/cancellation, dan return_to handling.
- **10:15–12:15:** Bangun halaman login dan signup dengan accessible forms, client validation yang
  sama kontraknya, password visibility, dan goey-toast.
- **13:15–15:15:** Bangun verify-email, resend, forgot-password, reset-password, activation, logout
  result, dan invalid/expired token states.
- **15:30–17:30:** Jalankan integration/E2E auth lokal, perbaiki responsive/accessibility, dan tulis
  Auth Gate report.

**Deliverables:**

- Auth frontend complete
- API integration
- Accessible feedback/toasts
- Auth gate report

**Acceptance criteria:**

- [ ] User active dapat login menuju dashboard
- [ ] Semua form mempunyai label/error accessible
- [ ] Credentials dikirim hanya ke API resmi
- [ ] Build dan auth tests lulus

**File/folder utama yang diperkirakan berubah:**

- `apps/auth/src/features/login`
- `apps/auth/src/features/signup`
- `apps/auth/src/features/recovery`
- `apps/auth/src/features/activation`

**Command verifikasi minimum:**

```bash
deno task test:auth
deno task build:auth
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-15.md`

---
