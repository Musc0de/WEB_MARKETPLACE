# StarSuperScare — AI Build Playbook

Playbook ini mengubah blueprint menjadi **50 hari kerja, 8 jam per hari**, untuk satu developer yang dibantu coding AI. Empat blok kerja harian memakai zona waktu Asia/Jakarta:

- 08:00–10:00
- 10:15–12:15
- 13:15–15:15
- 15:30–17:30

Targetnya bukan menjanjikan semua pekerjaan pasti selesai persis dalam 50 hari. Ini adalah urutan dependency yang aman. Bila satu acceptance gate belum lulus, lanjutkan hari tersebut sebelum masuk hari berikutnya.

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

## Cara memakai

1. Buka repository di coding agent yang dapat membaca dan mengedit file serta menjalankan terminal.
2. Tempel `00-MASTER-PROMPT.md` satu kali pada awal sesi/project instruction.
3. Kerjakan `prompts/DAY-01.md`, lalu lanjut berurutan.
4. Jangan melompati Gate Day 05, 10, 15, 20, 25, 30, 35, 40, 45, dan 50.
5. Setelah AI selesai, periksa diff dan hasil test sebelum commit.
6. Laporan AI disimpan di folder `progress/`; jangan percaya klaim tanpa output command.

## File penting

- `00-MASTER-PROMPT.md`: aturan tetap untuk coding agent.
- `01-DAILY-OPERATING-PROCEDURE.md`: ritme kerja dan review manusia.
- `02-EXTERNAL-SERVICE-GATES.md`: credential yang harus disediakan pada waktu yang tepat.
- `03-DEFINITION-OF-DONE.md`: syarat sebuah hari/phase dianggap selesai.
- `04-50-DAY-SUMMARY.md`: ringkasan seluruh roadmap.
- `weeks/`: jadwal per minggu dengan blok per jam.
- `prompts/`: 50 prompt siap-tempel.
- `templates/`: format laporan, blocker, dan ADR.

## Checkpoint utama

| Hari | Gate | Hasil minimum |
|---:|---|---|
| 5 | Foundation | Workspace, app scaffold, shared packages, CI |
| 10 | Database | Migration dari DB kosong dan seed berhasil |
| 15 | Auth | Signup/verify/login/session/recovery/activation bekerja |
| 20 | Catalog | Public catalog dan admin catalog/inventory bekerja |
| 25 | Storefront | Product list/detail/search/wishlist selesai |
| 30 | Checkout | Guest/user cart, order, reservation, payment mock/webhook selesai |
| 35 | Integration | Payment → invoice/email/account/notification teruji |
| 40 | Dashboard | Lifecycle client dapat dilihat dan dikelola |
| 45 | Operations | Return/support/admin/tracking selesai |
| 50 | Launch | Test, security, staging, production, handover |


---

# Master Prompt — Tempel Sekali pada Awal Sesi AI

Gunakan prompt ini sebagai konteks tetap sebelum menjalankan prompt harian.

~~~text
Anda adalah senior full-stack engineer, database engineer, security reviewer, dan test engineer yang mengerjakan repository StarSuperScare Marketplace.

Tujuan Anda adalah MEMODIFIKASI REPOSITORY secara bertahap sampai sistem production-ready. Jangan hanya memberikan tutorial atau potongan kode terpisah. Selalu inspeksi repository, edit file yang tepat, jalankan command yang relevan, dan buat laporan hasil.

SOURCE OF TRUTH:
1. README.md
2. START-HERE.md
3. DIRECTORY-TREE.md
4. MANIFEST.md
5. Dokumentasi fitur di docs/, apps/*/docs, packages/*/docs
6. Prompt hari yang sedang dikerjakan

ARSITEKTUR TETAP:
- starsuperscare.net = landing/public information
- shop.starsuperscare.net = catalog, products, cart, checkout
- auth.starsuperscare.net = login, signup, activation, recovery
- dashboard.starsuperscare.net = client account area
- api.starsuperscare.net/v1 = REST API and SSE
- admin.starsuperscare.net = admin operations
- tracking.starsuperscare.net = public tokenized tracking
- assets.starsuperscare.net = asset/CDN host when configured
- apps/worker = internal process, no public DNS

NON-NEGOTIABLE RULES:
- Do not invent, remove, or move subdomains/routes without a new ADR and explicit requirement.
- Cart and checkout stay in apps/storefront/shop, not dashboard.
- Only apps/api and apps/worker access Neon through packages/database.
- Runtime/workspace: Deno. Frontend: React + Vite. API: Hono. DB: Neon PostgreSQL. ORM/migrations: Drizzle. Validation/contracts: Zod.
- Money is integer IDR. Timestamps are UTC; UI renders id-ID / Asia/Jakarta.
- Login is username + password. Email is for verification, invoice, activation, recovery, and notifications.
- Guest account is provisioned only after verified successful payment. Never email a password.
- Product net_sold = paid quantity - finalized refunded quantity. Cart/pending order never increases sold.
- Persistent notifications use database read_at. SSE only accelerates UI updates.
- Use goey-toast only for transient UI feedback.
- Use adapters for payment, email, storage, and shipping. Missing credentials must use explicit development fakes, not fake production success.
- Every state-changing endpoint needs validation, authorization, error contract, audit where relevant, and tests.
- Never expose secrets, stack traces, raw card data, session tokens, token plaintext, or private files.

WORK METHOD:
1. Read requested documents and inspect current code/diff.
2. State a concise implementation plan tied to the prompt scope.
3. Implement smallest coherent vertical slice.
4. Add/update migrations, contracts, tests, docs, and env example as required.
5. Run applicable format/lint/type-check/test/build commands.
6. Fix failures within scope.
7. Write the required DAY-XX-REPORT.md with exact command results and remaining blockers.
8. Return: files changed, decisions, tests/results, migrations/env changes, blockers, and next-day handoff.

Do not ask for confirmation on ordinary implementation details. Make conservative, documented choices. If an external credential is missing, complete all provider-independent work and provide the exact env variables and verification steps needed later.
~~~


---

# Daily Operating Procedure

## Aturan pelaksanaan untuk AI coding agent

1. Baca file sumber yang disebut pada prompt hari itu sebelum mengubah kode.
2. Audit kode yang sudah ada; jangan menimpa pekerjaan hari sebelumnya secara membabi buta.
3. Kerjakan hanya scope hari itu dan shared prerequisite yang benar-benar diperlukan.
4. Jangan mengubah domain, batas aplikasi, database ownership, atau flow akun tanpa ADR baru.
5. Gunakan TypeScript strict; hindari `any`, non-null assertion, dan cast yang tidak dibuktikan.
6. Semua input eksternal divalidasi server-side dengan kontrak Zod. Client validation hanya untuk UX.
7. Semua nilai uang disimpan sebagai integer rupiah. Jangan memakai floating-point untuk total finansial.
8. Semua waktu disimpan UTC; UI memakai `id-ID` dan `Asia/Jakarta`.
9. Frontend tidak boleh memegang database URL, provider secret, session ID, atau raw payment data.
10. Password disimpan sebagai hash kuat; token sekali pakai disimpan sebagai digest; password tidak pernah dikirim lewat email.
11. Gunakan session cookie `Secure`, `HttpOnly`, host-only untuk API, explicit CORS credentials, CSRF protection, dan authorization default-deny.
12. Gunakan `goey-toast` untuk feedback aksi UI; notifikasi persisten tetap berasal dari database.
13. Payment/shipping/email/storage harus memakai adapter. Bila credential belum tersedia, buat deterministic fake untuk development/test dan dokumentasikan gap; jangan mengklaim integrasi nyata berhasil.
14. Jangan hanya menjelaskan. Edit file repository, tambahkan test, jalankan command, dan tunjukkan hasil nyata.
15. Jangan mengarang hasil command. Bila gagal, tampilkan error ringkas, perbaiki semampunya, lalu catat blocker yang tersisa.
16. Akhiri setiap hari dengan laporan di `docs/14-ai-build-playbook/progress/DAY-XX-REPORT.md` berisi perubahan, migration, env baru, command + hasil, risiko, blocker, dan handoff hari berikutnya.

## Ritme 8 jam

### 08:00–10:00 — Inspect dan design

- Baca dokumen sumber.
- Periksa `git status`, diff, migration history, test failures, dan laporan hari sebelumnya.
- Buat rencana perubahan file dan dependency.
- Jangan mulai dengan refactor luas yang tidak terkait scope.

### 10:15–12:15 — Core implementation

- Implement business/domain/database/API core hari itu.
- Tambahkan contract dan migration bersamaan dengan kode.
- Pertahankan transaction boundary dan idempotency.

### 13:15–15:15 — Integration dan UI

- Integrasikan layer lain yang berada dalam scope hari itu.
- Tambahkan error/loading/empty state.
- Tambahkan unit/integration/component test.

### 15:30–17:30 — Verify, review, report

- Jalankan formatter, linter, type-check, tests, dan build yang relevan.
- Review security, ownership, PII, log redaction, dan migration.
- Perbaiki failure.
- Tulis DAY-XX-REPORT dan commit hanya setelah review manusia.

## Checklist review manusia sebelum menerima output AI

- Buka `git diff --stat` dan `git diff`.
- Pastikan AI tidak menghapus atau memindahkan route/domain.
- Pastikan migration tidak destructive tanpa alasan.
- Pastikan env baru masuk `.env.example`, bukan `.env` nyata.
- Pastikan test benar-benar dijalankan, bukan hanya ditulis.
- Pastikan frontend tidak import `packages/database`.
- Pastikan API authorization tidak hanya bergantung pada ID dari URL.
- Pastikan semua nominal integer dan timestamp UTC.
- Commit kecil dengan pesan yang menjelaskan outcome, bukan aktivitas.


---

# External Service Gates

Coding AI dapat membangun adapter dan fake, tetapi layanan berikut memerlukan tindakan manusia/credential. Jangan memasukkan secret ke prompt, chat, commit, screenshot, atau file Markdown.

## Day 06 — Neon

Dibutuhkan:

- Project Neon.
- Branch/database `development`, `staging`, `production`.
- `DATABASE_URL` pooled untuk API/worker runtime.
- `DATABASE_URL_DIRECT` direct untuk migration.

Verifikasi: connection smoke test, migration development, dan query `select 1`.

## Day 18/32 — Object storage

Dibutuhkan S3-compatible storage atau provider setara untuk product images, bukti retur, attachments, digital files, dan private invoices.

Env generik:

```text
STORAGE_ENDPOINT
STORAGE_REGION
STORAGE_BUCKET_PUBLIC
STORAGE_BUCKET_PRIVATE
STORAGE_ACCESS_KEY_ID
STORAGE_SECRET_ACCESS_KEY
STORAGE_PUBLIC_BASE_URL
```

Gunakan presigned upload/download. Secret hanya pada API/worker.

## Day 29/45 — Shipping/courier

Sebelum provider dipilih, gunakan `MockShippingProvider` yang deterministic. Untuk provider nyata dibutuhkan base URL, client/key, webhook secret, dan mapping status.

## Day 30 — Payment gateway

Sebelum provider dipilih, gunakan `MockPaymentProvider`. Integrasi production membutuhkan:

```text
PAYMENT_PROVIDER
PAYMENT_PUBLIC_KEY
PAYMENT_SECRET_KEY
PAYMENT_WEBHOOK_SECRET
PAYMENT_RETURN_BASE_URL
```

Nama env spesifik mengikuti provider. Webhook, bukan redirect browser, adalah sumber status final.

## Day 32 — Transactional email

Dibutuhkan verified sender/domain dan API key. Env generik:

```text
EMAIL_PROVIDER
EMAIL_API_KEY
EMAIL_FROM_NAME
EMAIL_FROM_ADDRESS
EMAIL_REPLY_TO
```

Test/dev memakai fake inbox atau provider sandbox; jangan mengklaim delivery nyata tanpa provider response.

## Day 49 — Deployment dan DNS

Dibutuhkan akses deployment platform dan DNS untuk host yang sudah ada pada blueprint. `apps/worker` tidak mendapat DNS publik. Pastikan staging dan production memakai secret, DB branch, provider mode, bucket, dan webhook yang terpisah.


---

# Definition of Done

## Satu task selesai bila

- Scope sesuai prompt dan tidak menggeser arsitektur.
- Kode production dan error path tersedia.
- Input eksternal tervalidasi.
- Authentication/authorization diterapkan bila diperlukan.
- Unit/integration/component test relevan ditambahkan.
- Formatter, lint, type-check, tests, dan build terkait lulus.
- Migration/seed dapat dijalankan dari keadaan yang terdokumentasi.
- Env baru ditambahkan ke `.env.example` tanpa secret.
- Logging tidak memuat password, token, raw payment data, atau PII berlebihan.
- Dokumentasi dan laporan hari diperbarui.

## Satu phase gate selesai bila

- Semua acceptance criteria hari-hari phase terpenuhi.
- Happy path dan failure path kritis teruji.
- Tidak ada blocker severity tinggi yang disembunyikan.
- Database migration diuji pada database/branch bersih.
- Build seluruh app terdampak berhasil.
- Review manusia menyetujui diff.

## Tidak boleh disebut selesai bila

- AI hanya memberikan contoh tetapi tidak mengedit repository.
- Test belum dijalankan.
- Integrasi provider masih fake tetapi dilabeli production-ready.
- Secret hard-coded.
- Authorization hanya dilakukan di UI.
- Nominal finansial dihitung dari nilai client.
- Webhook tidak diverifikasi atau tidak idempotent.
- Migration destructive tidak mempunyai rollout/rollback plan.


---

# Minggu 1 — Foundation: arsitektur, workspace, app scaffold, CI

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

## Hari 01 — Audit repository dan kunci arsitektur

**Phase:** Fondasi repository

**Baca sebelum mulai:**

- `README.md`
- `START-HERE.md`
- `DIRECTORY-TREE.md`
- `MANIFEST.md`
- `docs/01-architecture/SUBDOMAINS-AND-ROUTES.md`
- `docs/13-decisions/DECISIONS.md`

**Jadwal per jam:**

- **08:00–10:00:** Inventaris semua file, status Git, konfigurasi yang sudah ada, dokumen yang saling bertentangan, serta bagian yang masih kosong. Jangan menulis fitur.
- **10:15–12:15:** Buat ADR-001 yang mengunci domain, batas aplikasi, alur request, aturan akses database, format uang, zona waktu, dan prinsip akun otomatis.
- **13:15–15:15:** Buat baseline backlog, daftar risiko, non-goals MVP, konvensi branch/commit, dan aturan bahwa perubahan arsitektur wajib melalui ADR baru.
- **15:30–17:30:** Validasi seluruh route terhadap dokumen sumber, buat laporan hari pertama, dan commit fondasi dokumentasi.

**Deliverables:**

- ADR-001 architecture freeze
- Baseline repository audit
- MVP scope dan non-goals
- Daily report Day 01

**Acceptance criteria:**

- [ ] Tidak ada subdomain atau aplikasi baru di luar blueprint
- [ ] Cart/checkout tetap di storefront
- [ ] Frontend tidak mengakses Neon langsung
- [ ] Kontradiksi dokumen dicatat, bukan disembunyikan

**File/folder utama yang diperkirakan berubah:**

- `docs/decisions/ADR-001-architecture-freeze.md`
- `docs/14-ai-build-playbook/progress/DAY-01-REPORT.md`
- `docs/project/BACKLOG.md`
- `docs/project/RISKS.md`

**Command verifikasi minimum:**

```bash
git status
git diff --check
```

**Prompt siap-tempel:** `../prompts/DAY-01.md`

---

## Hari 02 — Buat root Deno workspace dan tooling dasar

**Phase:** Fondasi repository

**Baca sebelum mulai:**

- `docs/12-roadmap/MVP-ROADMAP.md`
- `DIRECTORY-TREE.md`
- `deno.json.example`

**Jadwal per jam:**

- **08:00–10:00:** Buat root deno.jsonc, workspace globs, lockfile policy, import/catalog strategy, formatter, linter, dan strict TypeScript policy.
- **10:15–12:15:** Buat konfigurasi minimal untuk setiap apps/* dan packages/* yang tercantum pada blueprint; jangan mengisi fitur bisnis.
- **13:15–15:15:** Tambahkan root tasks untuk dev, format, lint, check, test, build, dan quality; tambahkan .editorconfig, .gitignore, serta VS Code settings.
- **15:30–17:30:** Instal/cache dependency yang sudah dipilih, jalankan quality baseline, perbaiki error, dan dokumentasikan cara menjalankan workspace.

**Deliverables:**

- Root Deno workspace valid
- Task runner konsisten
- Editor dan lockfile policy
- Workspace bootstrap documentation

**Acceptance criteria:**

- [ ] Semua member dikenali workspace
- [ ] Deno fmt dan lint dapat dijalankan dari root
- [ ] Tidak ada secret nyata masuk repository
- [ ] Task names terdokumentasi

**File/folder utama yang diperkirakan berubah:**

- `deno.jsonc`
- `deno.lock`
- `.editorconfig`
- `.gitignore`
- `.vscode/settings.json`
- `apps/*/deno.json`
- `packages/*/deno.json`

**Command verifikasi minimum:**

```bash
deno --version
deno install
deno fmt --check
deno lint
```

**Prompt siap-tempel:** `../prompts/DAY-02.md`

---

## Hari 03 — Scaffold lima aplikasi React + Vite

**Phase:** Fondasi repository

**Baca sebelum mulai:**

- `DIRECTORY-TREE.md`
- `apps/storefront/README.md`
- `apps/auth/README.md`
- `apps/dashboard/README.md`
- `apps/admin/README.md`
- `docs/01-architecture/SUBDOMAINS-AND-ROUTES.md`

**Jadwal per jam:**

- **08:00–10:00:** Scaffold storefront, auth, dashboard, admin, dan tracking sebagai React + Vite + TypeScript tanpa mengubah nama folder blueprint.
- **10:15–12:15:** Tambahkan router, App shell minimal, not-found page, error boundary, loading state, dan konfigurasi base URL per aplikasi.
- **13:15–15:15:** Hubungkan packages/ui dan packages/config secara minimal; tampilkan halaman identitas aplikasi agar setiap dev server mudah dibedakan.
- **15:30–17:30:** Jalankan type-check dan build untuk kelima aplikasi, perbaiki masalah dependency/workspace, lalu tulis petunjuk dev.

**Deliverables:**

- Lima frontend dapat berjalan
- Routing shell
- Error boundary dan 404
- Build frontend baseline

**Acceptance criteria:**

- [ ] Tidak ada fitur ditempatkan pada aplikasi yang salah
- [ ] Semua app memakai strict TypeScript
- [ ] Base API berasal dari env tervalidasi
- [ ] Build kelima app berhasil

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src`
- `apps/auth/src`
- `apps/dashboard/src`
- `apps/admin/src`
- `apps/tracking/src`

**Command verifikasi minimum:**

```bash
deno task build:frontends
deno task check
```

**Prompt siap-tempel:** `../prompts/DAY-03.md`

---

## Hari 04 — Scaffold Hono API dan worker internal

**Phase:** Fondasi repository

**Baca sebelum mulai:**

- `apps/api/README.md`
- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/05-api/ERROR-CONTRACT.md`
- `docs/01-architecture/REQUEST-FLOW.md`

**Jadwal per jam:**

- **08:00–10:00:** Buat composition root Hono, route /health dan /ready, version prefix /v1, serta server entrypoint untuk Deno.
- **10:15–12:15:** Buat request ID, structured logger, error envelope, not-found handler, dan exception handler tanpa membocorkan stack production.
- **13:15–15:15:** Buat worker entrypoint, lifecycle, graceful shutdown, polling interface kosong, dan health logging; worker bukan HTTP app publik.
- **15:30–17:30:** Tambahkan unit smoke test API/worker, jalankan lokal, dan dokumentasikan permission Deno minimum.

**Deliverables:**

- Hono API baseline
- Worker baseline
- Error contract
- Health/readiness tests

**Acceptance criteria:**

- [ ] GET /health memberi respons stabil
- [ ] Error contract seragam
- [ ] Worker dapat start/stop bersih
- [ ] Tidak ada koneksi DB dari frontend

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/main.ts`
- `apps/api/src/app.ts`
- `apps/api/src/middleware`
- `apps/worker/src/main.ts`

**Command verifikasi minimum:**

```bash
deno task dev:api
deno task test:api
deno task check
```

**Prompt siap-tempel:** `../prompts/DAY-04.md`

---

## Hari 05 — Shared packages, CI, dan quality gate

**Phase:** Fondasi repository

**Baca sebelum mulai:**

- `packages/database/README.md`
- `packages/auth/README.md`
- `packages/contracts/README.md`
- `packages/ui/README.md`
- `packages/email/README.md`
- `.env.example`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Buat export surface minimal untuk config, contracts, database, auth, ui, dan email; hindari circular dependency.
- **10:15–12:15:** Buat parser env terpusat dengan schema berbeda untuk frontend, API, worker, dan migration; tambahkan .env.example lengkap tanpa nilai rahasia.
- **13:15–15:15:** Buat CI yang menjalankan format, lint, type-check, unit test, build, dan dependency audit sesuai kemampuan repository.
- **15:30–17:30:** Jalankan CI-equivalent lokal, bereskan semua error, dokumentasikan dependency graph, dan tandai Foundation Gate.

**Deliverables:**

- Shared package skeletons
- Typed environment config
- CI pipeline
- Foundation gate report

**Acceptance criteria:**

- [ ] Satu perintah quality berjalan dari root
- [ ] Frontend env tidak memuat DATABASE_URL
- [ ] Dependency direction terdokumentasi
- [ ] CI gagal bila quality gate gagal

**File/folder utama yang diperkirakan berubah:**

- `packages/*/mod.ts`
- `packages/config`
- `.env.example`
- `.github/workflows/ci.yml`

**Command verifikasi minimum:**

```bash
deno task quality
deno task build
```

**Prompt siap-tempel:** `../prompts/DAY-05.md`

---


---

# Minggu 2 — Neon dan schema database

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

## Hari 06 — Hubungkan Neon, Drizzle, dan migration tooling

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/06-database/NEON-CONNECTION.md`
- `packages/database/README.md`
- `database/migrations/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Siapkan konfigurasi Neon development/staging/production dan dokumentasikan pooled runtime URL versus direct migration URL.
- **10:15–12:15:** Implement packages/database client untuk API/worker, Drizzle config untuk migration, serta pencegahan import database dari frontend.
- **13:15–15:15:** Buat connection smoke test, transaction helper, UTC timestamp convention, dan integer-IDR helper boundaries.
- **15:30–17:30:** Jalankan koneksi development, buat migration kosong pertama, cek secret hygiene, dan tulis panduan branch database.

**Deliverables:**

- Neon runtime client
- Drizzle migration config
- DB smoke test
- Environment matrix

**Acceptance criteria:**

- [ ] Runtime memakai pooled URL
- [ ] Migration memakai direct URL
- [ ] SSL diwajibkan
- [ ] DATABASE_URL hanya tersedia pada API/worker/migration

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/client.ts`
- `packages/database/drizzle.config.ts`
- `packages/database/src/transaction.ts`
- `scripts/db-smoke.ts`

**Command verifikasi minimum:**

```bash
deno task db:check
deno task db:generate
deno task quality
```

**External gate:**

- Neon project dan connection strings development diperlukan untuk koneksi nyata. Bila belum ada, selesaikan adapter dan gunakan test yang di-skip dengan alasan eksplisit.

**Prompt siap-tempel:** `../prompts/DAY-06.md`

---

## Hari 07 — Implement identity, role, profile, address, dan session schema

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/06-database/SCHEMA.md`
- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Model users, profiles, password credentials, roles, permissions, mappings, dan status lifecycle dengan constraint yang jelas.
- **10:15–12:15:** Model sessions, login attempts, verification/reset/activation tokens; simpan token digest, expiry, used/revoked timestamps.
- **13:15–15:15:** Model addresses dengan type shipping/billing, primary flags, ownership, dan normalisasi field Indonesia tanpa mengunci provider wilayah.
- **15:30–17:30:** Buat migration, schema tests untuk unique/index/FK, factory data, dan review keamanan field sensitif.

**Deliverables:**

- Identity schema
- Session/token schema
- RBAC schema
- Address schema dan tests

**Acceptance criteria:**

- [ ] Username dan normalized email unik
- [ ] Password plaintext tidak memiliki kolom
- [ ] Token hanya disimpan sebagai hash/digest
- [ ] Session dapat direvoke per perangkat

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/identity.ts`
- `packages/database/src/schema/rbac.ts`
- `packages/database/src/schema/addresses.ts`
- `migrations/*`

**Command verifikasi minimum:**

```bash
deno task db:generate
deno task db:migrate
deno task test:db
```

**Prompt siap-tempel:** `../prompts/DAY-07.md`

---

## Hari 08 — Implement catalog, pricing, inventory, dan review schema

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/06-database/SCHEMA.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Model brands, categories bertingkat, products, product-category mapping, product variants, status, type physical/digital, dan SEO fields.
- **10:15–12:15:** Model images/assets metadata dan pricing history dengan integer rupiah, compare-at price, effective range, serta constraint non-negatif.
- **13:15–15:15:** Model warehouses, inventory levels, reservations, movements ledger, purchase limit, dan concurrency/version field.
- **15:30–17:30:** Model rating/review statistics dan product_sales_stats gross/refunded/net; buat migration, index, tests, dan seed sample.

**Deliverables:**

- Catalog schema
- Price schema
- Inventory ledger/reservation schema
- Sold/rating stats schema

**Acceptance criteria:**

- [ ] Slug dan SKU unik
- [ ] Harga/stok tidak negatif
- [ ] net_sold dapat direkonsiliasi
- [ ] Produk digital tidak diwajibkan memiliki berat/shipping

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/catalog.ts`
- `packages/database/src/schema/inventory.ts`
- `packages/database/src/schema/reviews.ts`
- `migrations/*`

**Command verifikasi minimum:**

```bash
deno task db:generate
deno task db:migrate
deno task test:db
```

**Prompt siap-tempel:** `../prompts/DAY-08.md`

---

## Hari 09 — Implement cart, order, payment, invoice, shipment, dan digital schema

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/03-storefront/CHECKOUT.md`
- `docs/06-database/SCHEMA.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Model carts/cart_items untuk guest token hash atau user, active-cart uniqueness, selected/save-for-later state, dan price observation.
- **10:15–12:15:** Model orders/order_items/order_addresses sebagai immutable snapshot, order number, amount breakdown integer, status transitions, dan idempotency link.
- **13:15–15:15:** Model payments/payment_events, provider IDs, invoices, shipments/events, vouchers/redemptions, serta customer payment method token metadata.
- **15:30–17:30:** Model digital assets dan entitlements/download limits; buat migration, index, FK policy, dan schema tests.

**Deliverables:**

- Cart schema
- Order snapshot schema
- Payment/invoice/shipment schema
- Digital entitlement schema

**Acceptance criteria:**

- [ ] Order item tetap terbaca meski produk berubah
- [ ] Provider event ID unik
- [ ] Tidak ada raw card data
- [ ] Guest cart dan account cart dapat dibedakan aman

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/cart.ts`
- `packages/database/src/schema/orders.ts`
- `packages/database/src/schema/payments.ts`
- `packages/database/src/schema/digital.ts`

**Command verifikasi minimum:**

```bash
deno task db:generate
deno task db:migrate
deno task test:db
```

**Prompt siap-tempel:** `../prompts/DAY-09.md`

---

## Hari 10 — Implement purnajual, notifikasi, outbox, audit, seed, dan DB gate

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/06-database/SCHEMA.md`
- `docs/06-database/SCHEMA.md`
- `database/migrations/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Model returns, return_items, refunds, support tickets/messages, attachments metadata, dan verified-purchase reviews.
- **10:15–12:15:** Model notifications dengan read_at, notification deliveries, outbox events, job attempts, audit logs, serta idempotency keys.
- **13:15–15:15:** Buat seed roles/permissions/admin development/category/product/stock; buat data factory dan reset strategy khusus non-production.
- **15:30–17:30:** Jalankan migration dari database kosong, seed, schema assertions, dan DB gate report; perbaiki seluruh masalah constraint/index.

**Deliverables:**

- Purnajual/support schema
- Notification/outbox schema
- Audit/idempotency schema
- Repeatable migrations and seeds

**Acceptance criteria:**

- [ ] Migration fresh database berhasil
- [ ] Seed idempotent atau reset-safe
- [ ] read/unread hanya bersumber dari read_at
- [ ] Outbox siap diproses idempotent

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/aftercare.ts`
- `packages/database/src/schema/notifications.ts`
- `packages/database/src/schema/audit.ts`
- `database/seeds/*`

**Command verifikasi minimum:**

```bash
deno task db:reset:dev
deno task db:migrate
deno task db:seed
deno task test:db
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-10.md`

---


---

# Minggu 3 — API baseline dan autentikasi

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

## Hari 11 — Lengkapi API conventions, validation, CORS, CSRF, rate limit, dan RBAC context

**Phase:** API dan Auth

**Baca sebelum mulai:**

- `docs/05-api/ENDPOINTS.md`
- `docs/05-api/ERROR-CONTRACT.md`
- `docs/08-security/SECURITY-CHECKLIST.md`
- `docs/05-api/ERROR-CONTRACT.md`

**Jadwal per jam:**

- **08:00–10:00:** Buat route modules, dependency injection/context, typed success/error response, request parsing, pagination envelope, dan request ID propagation.
- **10:15–12:15:** Implement Zod validation middleware, sanitized errors, security headers, explicit CORS origin allowlist, dan credential handling.
- **13:15–15:15:** Implement CSRF strategy untuk state-changing cookie-auth requests, rate limiter interface/storage, dan trusted proxy configuration.
- **15:30–17:30:** Implement session loader dan RBAC/permission guard skeleton; tulis middleware tests termasuk origin, CSRF, dan error cases.

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

- **08:00–10:00:** Implement password policy dan Argon2id wrapper yang dapat diuji, constant-time comparison semantics, serta secure random token helpers.
- **10:15–12:15:** Implement POST /v1/auth/signup dengan transaction user/profile/credential, normalized identity, status pending_verification, dan audit event.
- **13:15–15:15:** Implement verification token issuance, resend throttling, POST /verify-email, token rotation/revocation, dan outbox email event.
- **15:30–17:30:** Tulis unit/integration tests untuk duplicate username/email, invalid input, token expiry/reuse, rollback, dan generic responses.

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

- **08:00–10:00:** Implement POST /auth/login dengan username normalized, generic credential error, throttling, account-status checks, dan audit login.
- **10:15–12:15:** Implement opaque session ID, database digest, expiry/idle timeout, rotation, Secure HttpOnly host-only cookie pada API, dan GET /session.
- **13:15–15:15:** Implement logout current, logout-all, session listing/revocation primitives, serta cleanup query untuk worker.
- **15:30–17:30:** Tulis tests untuk valid/invalid login, lock/rate limit, cookie flags, session rotation, revoked/expired session, dan cross-origin credential flow.

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

- **08:00–10:00:** Implement forgot-password generic response, reset token issuance, expiry/reuse prevention, password replacement, dan optional revoke-all sessions.
- **10:15–12:15:** Implement account activation endpoint untuk pending guest account: token verification, username final, password creation, email verification, dan activation audit.
- **13:15–15:15:** Implement return_to parser dengan allowlist host/path, anti-open-redirect, dan safe default dashboard home.
- **15:30–17:30:** Tulis integration tests untuk expired/reused token, reset unknown email, activation conflict, session revocation, dan malicious return_to.

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

- **08:00–10:00:** Bangun API client dengan credentials, CSRF bootstrap, typed errors, loading/cancellation, dan return_to handling.
- **10:15–12:15:** Bangun halaman login dan signup dengan accessible forms, client validation yang sama kontraknya, password visibility, dan goey-toast.
- **13:15–15:15:** Bangun verify-email, resend, forgot-password, reset-password, activation, logout result, dan invalid/expired token states.
- **15:30–17:30:** Jalankan integration/E2E auth lokal, perbaiki responsive/accessibility, dan tulis Auth Gate report.

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


---

# Minggu 4 — Catalog dan admin catalog/inventory

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

## Hari 16 — Public catalog API: list, detail, category, brand, search

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/05-api/ENDPOINTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement repository/service query untuk active products, variant summary, effective price, available stock, rating, review count, dan net_sold.
- **10:15–12:15:** Implement GET /products dengan page/per_page, search, category, brand, price range, stock, badges, dan sort allowlist.
- **13:15–15:15:** Implement GET /products/{slug}, categories, brands, reviews; gunakan typed contracts dan stable response envelope.
- **15:30–17:30:** Tulis query/integration tests, EXPLAIN critical queries bila tersedia, perbaiki index/N+1, dan seed data yang cukup untuk pagination.

**Deliverables:**

- Public product list/detail APIs
- Filter/sort/search
- Category/brand endpoints
- Catalog API tests

**Acceptance criteria:**

- [ ] Produk draft/inactive tidak bocor
- [ ] Harga/rating/sold/stok konsisten
- [ ] Pagination deterministic
- [ ] Query tidak N+1 pada card list

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/catalog`
- `apps/api/src/routes/v1/products.ts`
- `packages/contracts/src/catalog.ts`

**Command verifikasi minimum:**

```bash
deno task test:catalog
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-16.md`

---

## Hari 17 — Admin RBAC dan CRUD catalog API

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `apps/admin/README.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/08-security/SECURITY-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Definisikan permissions granular catalog.read/write/publish, inventory.adjust, order.manage, refund.manage, support.manage, dan admin role seed.
- **10:15–12:15:** Implement admin endpoints category, brand, product, variant, price, publish/unpublish/archive dengan Zod dan optimistic concurrency.
- **13:15–15:15:** Implement audit trail before/after yang aman, soft-delete policy, slug/SKU conflict handling, dan transaction boundaries.
- **15:30–17:30:** Tulis authorization matrix tests: unauthenticated, customer, staff terbatas, admin; pastikan default-deny.

**Deliverables:**

- RBAC permissions
- Admin catalog CRUD API
- Audit trail
- Authorization tests

**Acceptance criteria:**

- [ ] Customer tidak dapat mengakses /v1/admin/*
- [ ] Publish membutuhkan data minimum valid
- [ ] Perubahan tercatat audit
- [ ] Concurrent edit terdeteksi

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/admin/catalog`
- `apps/api/src/routes/v1/admin/catalog.ts`
- `packages/contracts/src/admin-catalog.ts`

**Command verifikasi minimum:**

```bash
deno task test:admin-api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-17.md`

---

## Hari 18 — Admin catalog UI dan upload assets

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `apps/admin/README.md`
- `docs/03-storefront/PRODUCTS.md`
- `docs/08-security/SECURITY-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun admin shell, auth guard, permission-aware navigation, product list, filters, empty/loading/error states.
- **10:15–12:15:** Bangun create/edit product, category, brand, variant, price, digital/physical fields, validation, dan unsaved-change guard.
- **13:15–15:15:** Implement object storage adapter/presigned upload flow untuk product image; validate MIME/size/ownership dan simpan metadata saja di Neon.
- **15:30–17:30:** Integrasikan goey-toast, optimistic UI yang aman, upload progress, build/test, dan dokumentasikan provider storage env.

**Deliverables:**

- Admin product UI
- Variant/price forms
- Asset upload adapter
- Admin UI tests

**Acceptance criteria:**

- [ ] Frontend tidak menerima storage secret
- [ ] Upload tervalidasi server
- [ ] Admin action mengikuti permission
- [ ] Form physical/digital conditional benar

**File/folder utama yang diperkirakan berubah:**

- `apps/admin/src/features/catalog`
- `apps/api/src/modules/assets`
- `packages/contracts/src/assets.ts`

**Command verifikasi minimum:**

```bash
deno task build:admin
deno task test:admin
deno task quality
```

**External gate:**

- Object storage S3-compatible diperlukan untuk upload nyata. Bila belum ada, gunakan in-memory/local development adapter dan jangan memalsukan URL production.

**Prompt siap-tempel:** `../prompts/DAY-18.md`

---

## Hari 19 — Inventory service, reservations primitive, dan admin stock UI

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `docs/03-storefront/CHECKOUT.md`
- `docs/06-database/SCHEMA.md`
- `apps/admin/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement inventory query dan movement service dengan transaction/locking, reason codes, actor, source reference, serta invariant available/reserved/sold.
- **10:15–12:15:** Implement stock adjustment, transfer-ready abstraction, low-stock query, and reservation primitive create/commit/release/expire.
- **13:15–15:15:** Bangun admin inventory list/detail/adjustment history dan form adjustment dengan permission plus confirmation.
- **15:30–17:30:** Tulis concurrency/invariant tests dan audit reconciliation report untuk sample data.

**Deliverables:**

- Inventory domain service
- Reservation primitives
- Admin inventory UI
- Concurrency tests

**Acceptance criteria:**

- [ ] Stok tidak dapat negatif
- [ ] Setiap perubahan memiliki ledger
- [ ] Reservation idempotent
- [ ] Adjustment manual diaudit

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/inventory`
- `apps/admin/src/features/inventory`
- `packages/contracts/src/inventory.ts`

**Command verifikasi minimum:**

```bash
deno task test:inventory
deno task build:admin
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-19.md`

---

## Hari 20 — Sold/rating statistics, review read model, dan Catalog Gate

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement pure functions dan database operations untuk gross_sold, refunded_sold, net_sold, average rating, review count, dan Indonesian sold label.
- **10:15–12:15:** Implement review public read API dengan moderation/verified flags dan aggregate recalculation/reconciliation command.
- **13:15–15:15:** Tambahkan sample paid/refunded/reviewed orders untuk test, lalu verifikasi card projection dan product detail response.
- **15:30–17:30:** Jalankan catalog/admin test suite, query review, quality gate, dan tulis Catalog Gate report.

**Deliverables:**

- Sales/rating projection
- Review read API
- Reconciliation command
- Catalog gate report

**Acceptance criteria:**

- [ ] Cart tidak mengubah sold
- [ ] Refund finalized mengoreksi net_sold
- [ ] Label 1,2 rb benar untuk locale Indonesia
- [ ] Aggregate dapat direbuild dari source events

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/catalog/stats.ts`
- `apps/api/src/modules/reviews/read.ts`
- `scripts/reconcile-product-stats.ts`

**Command verifikasi minimum:**

```bash
deno task test:catalog
deno task stats:reconcile:dry
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-20.md`

---


---

# Minggu 5 — Storefront products, search, wishlist

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

## Hari 21 — Storefront shell, design system, API client, dan goey-toast wrapper

**Phase:** Storefront

**Baca sebelum mulai:**

- `apps/storefront/README.md`
- `packages/ui/README.md`
- `docs/07-ui/GOOEY-TOAST.md`
- `docs/07-ui/GOOEY-TOAST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun design tokens, typography, spacing, buttons, forms, cards, skeleton, dialog, pagination, badge, dan responsive containers di packages/ui.
- **10:15–12:15:** Buat wrapper goey-toast terstandar untuk success/error/warning/info/promise, reduced-motion support, dan pesan Indonesia yang konsisten.
- **13:15–15:15:** Bangun storefront header/nav/search/cart/account shell, API client typed, currency/date/sold formatter, dan error boundary.
- **15:30–17:30:** Buat component tests/smoke page, audit keyboard/focus, dan build storefront baseline.

**Deliverables:**

- Shared UI foundation
- Goey-toast wrapper
- Storefront shell
- Formatter helpers

**Acceptance criteria:**

- [ ] Toast bukan pengganti persistent notification
- [ ] Reduced motion dihormati
- [ ] Currency IDR tanpa floating point
- [ ] Komponen keyboard-accessible

**File/folder utama yang diperkirakan berubah:**

- `packages/ui/src`
- `apps/storefront/src/app`
- `apps/storefront/src/lib/api.ts`
- `packages/ui/src/toast.tsx`

**Command verifikasi minimum:**

```bash
deno task test:ui
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-21.md`

---

## Hari 22 — Product list dan product card final

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/PRODUCTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /products data loader/query state dan URL pagination per_page=12 dengan cancellation serta cache policy sederhana.
- **10:15–12:15:** Bangun ProductCard berisi image, name, brand, category, regular/selling price, discount, rating, review count, net sold, stock, badges, dan wishlist state.
- **13:15–15:15:** Implement add-to-cart/buy-now/wishlist action stubs yang terhubung kontrak, responsive grid, skeleton, empty/error/out-of-stock states.
- **15:30–17:30:** Tulis component/integration tests untuk sold label, price discount, stock, new badge, action accessibility, dan mobile layout.

**Deliverables:**

- Products page
- Final ProductCard
- Responsive states
- Product card tests

**Acceptance criteria:**

- [ ] Tampilan memuat Terjual dan Stok
- [ ] Terjual 0 dapat diganti Baru sesuai rule
- [ ] Harga normal/promo jelas
- [ ] Out-of-stock mencegah CTA invalid

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/catalog/pages/ProductsPage.tsx`
- `apps/storefront/src/features/catalog/components/ProductCard.tsx`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-22.md`

---

## Hari 23 — Product detail, variants, gallery, reviews, dan related products

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/PRODUCTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /products/{slug} loader dengan not-found/inactive states dan metadata dasar.
- **10:15–12:15:** Bangun gallery, product summary, variant selector, effective price, stock, quantity limits, add-cart, buy-now, wishlist, dan shipping/digital indicator.
- **13:15–15:15:** Bangun tabs/accordion description, benefits, composition, usage, warning, shipping, reviews, serta related products.
- **15:30–17:30:** Tulis tests untuk variant URL/state, sold/stock display, quantity clamping, image alt, and out-of-stock behavior.

**Deliverables:**

- Product detail page
- Variant-aware CTA
- Review display
- Related products

**Acceptance criteria:**

- [ ] Cart action selalu membawa variant_id
- [ ] Harga/stok berubah saat variant berubah
- [ ] Semua image punya alt
- [ ] Inactive slug memberi 404 aman

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/catalog/pages/ProductDetailPage.tsx`
- `apps/storefront/src/features/catalog/components`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-23.md`

---

## Hari 24 — Search, category, brand, filters, sort, dan URL state

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/PRODUCTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /search, /categories/{slug}, dan /brands/{slug} menggunakan endpoint yang sama dan URL query sebagai source of truth.
- **10:15–12:15:** Implement keyword debounce, filter category/brand/price/stock/rating/promo, sort allowlist, reset filter, dan mobile filter drawer.
- **13:15–15:15:** Jaga browser back/forward, shareable URLs, page reset saat filter berubah, serta empty suggestions/popular products.
- **15:30–17:30:** Tulis query-state tests, accessibility, and API error recovery; build storefront.

**Deliverables:**

- Search page
- Category/brand listing
- Filter/sort UI
- URL-state tests

**Acceptance criteria:**

- [ ] URL dapat dibagikan dan direstore
- [ ] Invalid query jatuh ke default aman
- [ ] Filter tidak menghapus parameter yang relevan
- [ ] Mobile controls accessible

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/search`
- `apps/storefront/src/features/catalog/filters`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-24.md`

---

## Hari 25 — Wishlist guest/account dan Storefront Gate

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/CART.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement guest wishlist local storage dengan versioned schema, graceful corruption handling, dan no-sensitive-data rule.
- **10:15–12:15:** Implement account wishlist API list/add/remove, ownership, duplicate prevention, stock/price projection, dan optional merge after login.
- **13:15–15:15:** Integrasikan heart state pada list/detail, optimistic update rollback, goey-toast, dan dashboard deep link.
- **15:30–17:30:** Jalankan storefront tests, accessibility smoke, performance baseline, dan tulis Storefront Gate report.

**Deliverables:**

- Guest wishlist
- Account wishlist API
- Wishlist UI integration
- Storefront gate report

**Acceptance criteria:**

- [ ] Guest wishlist tetap setelah refresh
- [ ] User hanya melihat wishlist sendiri
- [ ] Optimistic failure di-rollback
- [ ] Product data tetap berasal dari server

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/wishlist`
- `apps/storefront/src/features/wishlist`
- `packages/contracts/src/wishlist.ts`

**Command verifikasi minimum:**

```bash
deno task test:wishlist
deno task test:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-25.md`

---


---

# Minggu 6 — Cart, checkout, order, payment

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

## Hari 26 — Cart API untuk guest dan account

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/03-storefront/CART.md`
- `docs/05-api/ENDPOINTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement guest cart token issuance dengan random opaque token, server-side digest, expiry/rotation, serta one-active-cart invariant.
- **10:15–12:15:** Implement GET cart dan add/update/remove/clear item transactionally untuk guest atau session user.
- **13:15–15:15:** Hitung line totals/discount/subtotal di server, return item status available/out_of_stock/price_changed/inactive/quantity_adjusted.
- **15:30–17:30:** Tulis authorization, token, validation, concurrent update, purchase limit, and total calculation tests.

**Deliverables:**

- Guest cart identity
- Cart CRUD API
- Server-calculated totals
- Cart API tests

**Acceptance criteria:**

- [ ] Browser tidak menjadi source of truth cart
- [ ] Guest token tidak disimpan plaintext DB
- [ ] Harga client diabaikan
- [ ] User tidak dapat membaca cart lain

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/cart`
- `apps/api/src/routes/v1/cart.ts`
- `packages/contracts/src/cart.ts`

**Command verifikasi minimum:**

```bash
deno task test:cart
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-26.md`

---

## Hari 27 — Cart merge, revalidation, voucher, dan save-for-later

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement POST /cart/merge transaction: merge variant sama, clamp stock/purchase limit, latest price, merged marker, dan idempotency.
- **10:15–12:15:** Implement revalidation saat cart dibaca/diubah, warning changes, inactive cleanup policy, dan race-safe versioning.
- **13:15–15:15:** Implement save-for-later dan voucher validation/application dasar dengan explicit rule engine serta integer amounts.
- **15:30–17:30:** Tulis merge matrix tests, price/stock changes, duplicate retry, voucher edge cases, dan rollback behavior.

**Deliverables:**

- Idempotent cart merge
- Real-time revalidation
- Voucher foundation
- Save-for-later

**Acceptance criteria:**

- [ ] Merge ulang tidak menduplikasi item
- [ ] Stok tidak terlampaui
- [ ] Perubahan harga transparan
- [ ] Voucher tidak dipercaya dari client

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/cart/merge.ts`
- `apps/api/src/modules/cart/revalidate.ts`
- `apps/api/src/modules/vouchers`

**Command verifikasi minimum:**

```bash
deno task test:cart
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-27.md`

---

## Hari 28 — Cart UI lengkap

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/03-storefront/CART.md`
- `docs/07-ui/GOOEY-TOAST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /cart loader dan cart summary untuk guest/session dengan states loading/empty/error/expired token.
- **10:15–12:15:** Bangun item table/card responsive, select checkout, increment/decrement, remove, clear, save-for-later, voucher, dan order note.
- **13:15–15:15:** Tampilkan server totals, price/stock warnings, shipping estimate placeholder yang jelas, and checkout eligibility.
- **15:30–17:30:** Tulis UI/integration tests, keyboard/focus, optimistic mutation rollback, goey-toast, and build storefront.

**Deliverables:**

- Cart page
- CRUD interactions
- Warnings and totals
- Cart UI tests

**Acceptance criteria:**

- [ ] Total selalu dari response server
- [ ] Mutation disabled saat pending
- [ ] Warning price/stock terlihat
- [ ] Mobile cart tetap usable

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/cart`
- `apps/storefront/src/pages/CartPage.tsx`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-28.md`

---

## Hari 29 — Checkout address/shipping/review, order snapshot, dan stock reservation

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CHECKOUT.md`
- `docs/03-storefront/CHECKOUT.md`
- `docs/03-storefront/CHECKOUT.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement address validation/persistence and guest address input, shipping option adapter dengan deterministic mock, serta digital-only no-shipping branch.
- **10:15–12:15:** Implement checkout validate/shipping-options endpoints dan server recomputation untuk product, stock, price, voucher, shipping, tax, total.
- **13:15–15:15:** Implement POST /checkout/orders dengan idempotency key, immutable order/address/item snapshot, dan inventory reservation expiry.
- **15:30–17:30:** Bangun address/shipping/review UI state machine, recovery after refresh, tests untuk mixed cart, stale price/stock, duplicate submit, and reservation release schedule.

**Deliverables:**

- Checkout validation
- Shipping adapter
- Idempotent order creation
- Inventory reservation and checkout UI

**Acceptance criteria:**

- [ ] Double-click tidak membuat dua order
- [ ] Digital-only tidak meminta shipping
- [ ] Order total dihitung server
- [ ] Reservation punya expiry dan release path

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/checkout`
- `apps/api/src/modules/shipping`
- `apps/storefront/src/features/checkout`

**Command verifikasi minimum:**

```bash
deno task test:checkout
deno task test:inventory
deno task build:storefront
deno task quality
```

**External gate:**

- Real shipping provider dapat ditambahkan nanti melalui adapter. Mock harus jelas hanya untuk development/test.

**Prompt siap-tempel:** `../prompts/DAY-29.md`

---

## Hari 30 — Payment adapter, verified webhook, dan Checkout Gate

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CHECKOUT.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Definisikan PaymentProvider interface dan implement deterministic sandbox/mock provider tanpa menyimpan raw card data.
- **10:15–12:15:** Implement create payment intent/session, payment page handoff, pending/success/failed UI, dan provider reference persistence.
- **13:15–15:15:** Implement webhook signature verification contract, unique provider event, state transition validation, transaction order paid + reservation commit + outbox.
- **15:30–17:30:** Tulis duplicate/out-of-order/invalid-signature tests, browser-success-not-source-of-truth test, quality gate, dan Checkout Gate report.

**Deliverables:**

- Payment provider abstraction
- Payment flow UI/API
- Idempotent verified webhook
- Checkout gate report

**Acceptance criteria:**

- [ ] Order paid hanya lewat event terverifikasi
- [ ] Duplicate webhook aman
- [ ] Invalid signature ditolak
- [ ] Raw payment secret/card data tidak dilog

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/payments`
- `apps/api/src/routes/v1/webhooks.ts`
- `apps/storefront/src/features/checkout/payment`

**Command verifikasi minimum:**

```bash
deno task test:payments
deno task test:checkout
deno task quality
```

**External gate:**

- Pilih dan siapkan payment gateway sandbox untuk integrasi nyata. Sampai tersedia, mock provider harus mencakup success, pending, failed, duplicate, dan invalid webhook.

**Prompt siap-tempel:** `../prompts/DAY-30.md`

---


---

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


---

# Minggu 8 — Dashboard client

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

## Hari 36 — Dashboard shell, route guards, navigation, dan home summary

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `apps/dashboard/README.md`
- `docs/04-dashboard/README.md`
- `docs/04-dashboard/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun dashboard API client/session bootstrap, protected route guard, unauthorized/expired flow, error boundary, dan app layout.
- **10:15–12:15:** Bangun desktop sidebar sesuai blueprint dan mobile nav Home/Orders/Cart/Notifications/Account; Cart link kembali ke shop.
- **13:15–15:15:** Implement home summary endpoint dan UI: active orders, latest, shipping, total purchases, unread notification, unpaid status, recommendation link.
- **15:30–17:30:** Tulis dashboard shell/home tests, loading/empty/error states, accessibility, and responsive build.

**Deliverables:**

- Protected dashboard shell
- Desktop/mobile navigation
- Home summary API/UI
- Dashboard baseline tests

**Acceptance criteria:**

- [ ] Unauthenticated diarahkan ke auth dengan safe return_to
- [ ] Cart tidak dipindah ke dashboard
- [ ] Total IDR server-derived
- [ ] Mobile nav sesuai blueprint

**File/folder utama yang diperkirakan berubah:**

- `apps/dashboard/src/app`
- `apps/dashboard/src/features/home`
- `apps/api/src/modules/dashboard/home.ts`

**Command verifikasi minimum:**

```bash
deno task test:dashboard
deno task build:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-36.md`

---

## Hari 37 — Profile, security, sessions, addresses, dan payment method metadata

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/04-dashboard/README.md`
- `docs/04-dashboard/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement GET/PATCH /me dan profile UI untuk name, email display/policy, phone, avatar metadata, joined date, and validation.
- **10:15–12:15:** Implement change password, sessions list, revoke one/all other sessions, login history summary, and security feedback.
- **13:15–15:15:** Implement addresses CRUD/default shipping/billing with ownership and dashboard UI.
- **15:30–17:30:** Implement tokenized payment-method metadata list/delete only if provider supports it; no raw card data; test ownership and responsive forms.

**Deliverables:**

- Profile UI/API
- Security/session management
- Address CRUD
- Payment method metadata

**Acceptance criteria:**

- [ ] Password lama diverifikasi
- [ ] Password tidak ditampilkan
- [ ] Session revoke efektif
- [ ] Card PAN/CVV tidak tersimpan

**File/folder utama yang diperkirakan berubah:**

- `apps/dashboard/src/features/profile`
- `apps/dashboard/src/features/addresses`
- `apps/dashboard/src/features/payment-methods`
- `apps/api/src/modules/me`

**Command verifikasi minimum:**

```bash
deno task test:dashboard
deno task test:auth
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-37.md`

---

## Hari 38 — Orders list, detail, tracking, buy-again, dan invoice link

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`
- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement user-scoped orders list with tabs Semua/Aktif/Selesai/Dibatalkan/Refund, stable pagination, and summary fields.
- **10:15–12:15:** Implement order detail endpoint/UI with snapshots, payment/shipping/status timeline, totals, invoice and product links.
- **13:15–15:15:** Implement tracking endpoint/UI and buy-again service yang revalidasi product/variant/price/stock sebelum menambah cart.
- **15:30–17:30:** Tulis ownership/IDOR tests, status display, mixed digital/physical tracking, buy-again warnings, and responsive detail tests.

**Deliverables:**

- Orders list/detail
- Tracking timeline
- Buy again
- Order ownership tests

**Acceptance criteria:**

- [ ] User hanya membaca order sendiri
- [ ] Order number bukan authorization
- [ ] Buy-again tidak memakai harga lama
- [ ] Detail tidak bergantung pada product aktif

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/orders`
- `apps/dashboard/src/features/orders`

**Command verifikasi minimum:**

```bash
deno task test:orders
deno task test:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-38.md`

---

## Hari 39 — History, invoices, dan digital downloads

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`
- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement /history default per_page=5 dengan status/year/start_date/end_date, total transactions/nominal/completed/refund summary.
- **10:15–12:15:** Bangun history UI, filter URL state, IDR/time formatting id-ID Asia/Jakarta, buy-again, review, and invoice actions.
- **13:15–15:15:** Implement invoices list/detail/download authorization dan signed/streamed private file access.
- **15:30–17:30:** Implement digital entitlements/download list, expiry/download-count checks, secure download, and tests for ownership/tampering.

**Deliverables:**

- History API/UI
- Invoice center
- Secure invoice download
- Digital downloads

**Acceptance criteria:**

- [ ] Pagination default 5
- [ ] Date input canonical dan timezone-safe
- [ ] File access user-scoped
- [ ] Download entitlement enforced

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/history`
- `apps/api/src/modules/invoices`
- `apps/api/src/modules/downloads`
- `apps/dashboard/src/features/history`

**Command verifikasi minimum:**

```bash
deno task test:history
deno task test:invoices
deno task build:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-39.md`

---

## Hari 40 — Notifications, wishlist, reviews, settings, dan Dashboard Gate

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/04-dashboard/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun notification center list/read/read-all/unread badge dan SSE listener dengan reconnect, REST refresh, and goey-toast for live events.
- **10:15–12:15:** Bangun account wishlist page dengan stock/price projection, remove/add-cart/product links.
- **13:15–15:15:** Implement eligible verified-purchase reviews list/create/edit/delete policy dan settings profile/security/notification/privacy shells.
- **15:30–17:30:** Jalankan dashboard tests, accessibility/mobile audit, build, dan tulis Dashboard Gate report.

**Deliverables:**

- Notification center + SSE
- Wishlist dashboard
- Reviews lifecycle
- Settings and dashboard gate

**Acceptance criteria:**

- [ ] Toast live tidak menggantikan database record
- [ ] Review hanya untuk eligible order item
- [ ] Unread badge pulih setelah reconnect
- [ ] Semua route mobile usable

**File/folder utama yang diperkirakan berubah:**

- `apps/dashboard/src/features/notifications`
- `apps/dashboard/src/features/wishlist`
- `apps/dashboard/src/features/reviews`
- `apps/dashboard/src/features/settings`

**Command verifikasi minimum:**

```bash
deno task test:dashboard
deno task build:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-40.md`

---


---

# Minggu 9 — Returns, support, admin operations, tracking

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

## Hari 41 — Returns dan refunds end-to-end

**Phase:** Operasional dan purnajual

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/06-database/SCHEMA.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement return eligibility policy by order item/status/window, create request, reason, quantity, evidence metadata, communication history.
- **10:15–12:15:** Implement dashboard returns/refunds list/detail/form/upload flow dan user ownership.
- **13:15–15:15:** Implement admin review/approve/reject/receive/refund actions dengan permission, provider refund adapter, audit, and idempotency.
- **15:30–17:30:** Update finalized refund to refunded_sold/net_sold and optional restock decision; test partial/full/duplicate/refund-failure cases.

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

- **08:00–10:00:** Implement public/account FAQ read model and support ticket create/list/detail with category, order link validation, priority/status, and ownership.
- **10:15–12:15:** Implement ticket message thread and private attachment upload/download with MIME/size/authorization rules.
- **13:15–15:15:** Bangun dashboard support UI dan admin queue/detail/reply/assign/status workflow dengan notifications/outbox.
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

- **08:00–10:00:** Implement admin order list/detail filters, status timeline, customer snapshot, items, totals, payment, shipment, invoice, and support links.
- **10:15–12:15:** Implement permitted operations: mark processing, attach shipment, cancel rules, resend invoice, retry job, without editing immutable financial snapshot arbitrarily.
- **13:15–15:15:** Implement payment events/invoice/customer list/detail with least-privilege data masking and no password/session secret exposure.
- **15:30–17:30:** Bangun admin UI, audit all state changes, and authorization/status-transition tests.

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

- **08:00–10:00:** Implement review moderation queue with publish/reject policy, reason, audit, and aggregate recalculation.
- **10:15–12:15:** Complete admin catalog/inventory operations including low stock, movement history, product status, and bulk action safeguards.
- **13:15–15:15:** Build operational dashboard cards for orders/payments/outbox/email/low-stock using bounded queries and permission-aware metrics.
- **15:30–17:30:** Build audit log viewer with filters/redaction, test admin boundaries, and responsive admin build.

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

- **08:00–10:00:** Implement opaque public tracking token issue/revoke/expiry and endpoint projection that exposes only safe shipment/order fields.
- **10:15–12:15:** Implement shipment provider adapter/webhook or deterministic mock, unique event handling, timeline ordering, and order notification outbox.
- **13:15–15:15:** Bangun tracking app with token route, invalid/expired/not-found states, timeline, estimated delivery, and no account PII.
- **15:30–17:30:** Run operations integration tests, security review tracking enumeration, build admin/dashboard/tracking, and write Operations Gate report.

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

- Real courier integration dapat mengganti mock adapter setelah akun provider dan webhook secret tersedia.

**Prompt siap-tempel:** `../prompts/DAY-45.md`

---


---

# Minggu 10 — Testing, security, staging, production

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

## Hari 46 — Lengkapi unit/integration test, factories, dan coverage gate

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `docs/10-testing/TEST-PLAN.md`
- `docs/10-testing/TEST-PLAN.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Audit test coverage by domain and map every critical invariant/status transition to at least one test.
- **10:15–12:15:** Lengkapi unit tests price/discount/sold/cart merge/voucher/order total/token expiry/permission/status transition.
- **13:15–15:15:** Lengkapi integration tests auth/catalog/cart/reservation/payment/refund/outbox/invoice/notification/support menggunakan isolated test DB/branch.
- **15:30–17:30:** Stabilkan factories, time/random/provider fakes, parallelization policy, coverage report, and fail threshold.

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

- **08:00–10:00:** Set up E2E runner and isolated environment; seed deterministic user/products/payment mock and launch all required apps.
- **10:15–12:15:** Automate guest product→cart→checkout→paid→invoice/account activation→login→dashboard order journey.
- **13:15–15:15:** Automate signup/login/recovery, cart merge, wishlist, history pagination, notification reconnect, return, support, admin operations, and public tracking.
- **15:30–17:30:** Run accessibility keyboard/focus/labels/contrast checks and desktop/mobile viewport suite; capture artifacts on failure.

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

- **08:00–10:00:** Threat-model auth/payment/upload/IDOR/webhook/SSE/tracking/admin; remediate high risks, headers, CSRF, CORS, rate limit, validation, and authorization.
- **10:15–12:15:** Audit dependency/secrets/log redaction, cookie flags, token handling, upload controls, CSP, and production error responses.
- **13:15–15:15:** Implement structured logs, health/readiness, metrics/alerts for errors, latency, webhook failures, email failures, outbox backlog, and stock anomalies.
- **15:30–17:30:** Document and rehearse Neon backup/restore or branch-based recovery, migration rollback/forward, incident response, and provider outage runbooks.

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

- **08:00–10:00:** Create staging environment matrix, deployment configs for each existing app, secret injection, build commands, and Neon staging branch.
- **10:15–12:15:** Run migration rehearsal from production-like snapshot, deploy API/worker first then frontends, and verify health/readiness.
- **13:15–15:15:** Configure only documented DNS hosts, HTTPS, CORS allowlist, API host-only secure session cookie, CSP, object storage, payment/email/shipping webhooks.
- **15:30–17:30:** Run staging smoke/E2E/UAT, capture defects, fix release blockers, freeze release candidate, and document rollback.

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

- Deployment platform, DNS access, Neon staging, email/payment/storage/shipping sandbox credentials diperlukan untuk UAT penuh.

**Prompt siap-tempel:** `../prompts/DAY-49.md`

---

## Hari 50 — Production release, smoke test, rollback readiness, dan handover

**Phase:** Hardening dan rilis

**Baca sebelum mulai:**

- `IMPLEMENTATION-CHECKLIST.md`
- `docs/11-deployment/DENO-DEPLOY-NEON.md`
- `IMPLEMENTATION-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Review release diff, dependency lock, secrets, database migration, backup/restore point, feature flags, provider production settings, and change approval.
- **10:15–12:15:** Run production migration with logs, deploy API and worker, verify health, then deploy storefront/auth/dashboard/admin/tracking and public site as applicable.
- **13:15–15:15:** Run production smoke: login, products, cart, provider-approved controlled payment verification, webhook, invoice, email, activation, dashboard, admin, tracking, notification. Jangan memakai sandbox credential pada production.
- **15:30–17:30:** Monitor errors/latency/outbox/webhooks/email, execute rollback if thresholds breached, finalize release notes, handover docs, and 24-hour observation checklist.

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

- Production credentials dan explicit change approval diperlukan. Jangan pernah menguji transaksi riil tanpa prosedur pembayaran aman yang disetujui.

**Prompt siap-tempel:** `../prompts/DAY-50.md`

---


---
