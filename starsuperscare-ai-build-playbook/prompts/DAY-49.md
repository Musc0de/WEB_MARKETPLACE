# Prompt Hari 49 — Deploy staging, migration rehearsal, DNS/CORS/cookie validation, dan UAT

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 49/50 — DEPLOY STAGING, MIGRATION REHEARSAL, DNS/CORS/COOKIE VALIDATION, DAN UAT
PHASE: Hardening dan rilis

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/11-deployment/DENO-DEPLOY-NEON.md
- .env.example
- docs/01-architecture/SUBDOMAINS-AND-ROUTES.md
- IMPLEMENTATION-CHECKLIST.md
- docs/14-ai-build-playbook/progress/DAY-48-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Create staging environment matrix, deployment configs for each existing app, secret injection, build commands, and Neon staging branch.
2. 10:15–12:15 — Run migration rehearsal from production-like snapshot, deploy API/worker first then frontends, and verify health/readiness.
3. 13:15–15:15 — Configure only documented DNS hosts, HTTPS, CORS allowlist, API host-only secure session cookie, CSP, object storage, payment/email/shipping webhooks.
4. 15:30–17:30 — Run staging smoke/E2E/UAT, capture defects, fix release blockers, freeze release candidate, and document rollback.

DELIVERABLE WAJIB:
- Staging deployments
- Migration rehearsal
- DNS/security validation
- Signed UAT/release candidate

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- infrastructure/deploy
- docs/releases/RC-1.md
- docs/runbooks/rollback.md

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- No architecture/domain drift
- Staging uses non-production DB/provider credentials
- All canonical URLs work
- Rollback steps tested/documented

EXTERNAL GATE:
- Deployment platform, DNS access, Neon staging, email/payment/storage/shipping sandbox credentials diperlukan untuk UAT penuh.

IMPLEMENTATION RULES:
- Pertahankan persis arsitektur domain dan batas aplikasi pada README/START-HERE.
- Inspect existing code dan git diff dahulu; integrate, jangan overwrite membabi buta.
- Gunakan TypeScript strict dan contracts Zod untuk boundary.
- Frontend tidak boleh import/access database.
- Semua uang integer IDR; timestamp UTC; UI id-ID/Asia/Jakarta.
- Tambahkan authorization dan ownership check server-side; UI guard tidak cukup.
- Gunakan transaction dan idempotency untuk operasi yang dapat diulang.
- Jangan hard-code secret atau menaruh secret pada frontend.
- Tambahkan success, loading, empty, error, retry, dan accessibility state bila ada UI.
- Gunakan goey-toast hanya untuk transient UI feedback.
- Jangan mengerjakan fitur hari berikutnya kecuali prerequisite kecil yang tak terpisahkan; dokumentasikan bila dilakukan.

COMMAND VERIFICATION MINIMUM:
- deno task build
- deno task test:smoke:staging
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-49-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 50.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-49-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
