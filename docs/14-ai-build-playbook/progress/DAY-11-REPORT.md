# Day 11 Report - Implement API Conventions, Validation, Security & Auth Middleware

## Phase: API dan Auth

**Status:** `PASSED` **Tanggal:** 12 Juli 2026

### 1. Ringkasan Modul Baru & Modifikasi

- **API Contracts (`packages/contracts/src/http.ts`)**: Pembuatan antarmuka _envelope response_
  (`ApiResponse`, `PaginatedMeta`) dan _Zod schemas_ dasar agar komunikasi antara _backend_ dan
  _frontend_ tersistem dengan rapi.
- **Error & Validation Middleware (`validator.ts`, `error-handler.ts`)**: Menyederhanakan
  penangkapan error dengan `zValidator` Hono, dan mengkonversi _HTTPException_ serta _ZodError_
  menjadi `ApiError` agar tidak terjadi kebocoran _stack trace_ ke sisi klien.
- **Security Hardening (`app.ts`, `csrf.ts`)**:
  - Pengetatan parameter CORS agar hanya mengizinkan _Origin_ dari whitelist eksplisit.
  - Pembuatan _custom middleware CSRF protection_ untuk mendeteksi ancaman _cross-site request
    forgery_ berbasis pengecekan _Origin_ dan _Referer_ secara ketat.
- **Rate Limiter (`rate-limiter.ts`)**: Kerangka pembatas beban trafik (_Rate Limiter_) berbasis
  _in-memory Map_ (disiapkan untuk diganti ke Redis kelak).
- **Session & RBAC Context (`auth.ts`)**: Penyusunan `sessionLoader` dan _guard_ eksklusif
  `requirePermission` menggunakan _default-deny_ pattern untuk perlindungan rute admin.

### 2. File Berubah Utama

- `packages/contracts/src/http.ts` (NEW)
- `apps/api/src/app.ts`
- `apps/api/src/middleware/validator.ts` (NEW)
- `apps/api/src/middleware/csrf.ts` (NEW)
- `apps/api/src/middleware/rate-limiter.ts` (NEW)
- `apps/api/src/middleware/auth.ts` (NEW)
- `apps/api/src/middleware/error-handler.ts`
- `apps/api/tests/middleware.test.ts` (NEW)
- `apps/api/deno.json`

### 3. Migration & Environment

- Menambahkan kapabilitas konfigurasi `ALLOWED_ORIGINS` ke _Environment Variable_ agar _whitelist_
  CORS bisa disetel tanpa modifikasi kode langsung.
- Tidak ada modifikasi skema DB.
- Menambahkan dependensi `jsr:@std/assert@1.0.19` pada `apps/api` untuk unit testing.

### 4. Command Verification

```bash
# Pengujian Middleware
$ deno task --cwd apps/api test
running 2 tests from ./src/app.test.ts
API /health endpoint returns healthy status ... ok (11ms)
API not found endpoint returns correct envelope ... ok (705µs)

running 4 tests from ./tests/middleware.test.ts
Middleware: CORS should reject disallowed origins ... ok (12ms)
Middleware: CORS should allow allowed origins ... ok (1ms)
Middleware: CSRF should block state-changing requests without valid origin ... ok (1ms)
Middleware: Request ID should be propagated ... ok (845µs)

ok | 6 passed | 0 failed (102ms)
```

### 5. Blocker & Technical Debt

- **Hono Native CSRF Incompatibility**: _Hono middleware_ bawaan `hono/csrf` agak longgar dan tidak
  merespon _Origin_ ilegal dengan presisi (bahkan mereturn _200 OK_ jika origin berbentuk array tak
  sinkron). Blocker ini telah diatasi dengan meracik _custom CSRF middleware_ `csrfProtection` murni
  yang mengecek _Origin/Referer header_ selaras pedoman OWASP.

### 6. Handoff Day 12

- Pondasi API (CORS, CSRF, Validasi, Rate Limiter) beserta struktur _Envelope Response_ telah
  **rampung 100%**.
- Handoff selanjutnya difokuskan pada pengolahan rute domain spesifik (_Authentication Router_ dan
  penyempurnaan Endpoint otentikasi nyata menggunakan _Session Manager_).
