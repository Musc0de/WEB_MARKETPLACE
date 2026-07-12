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
