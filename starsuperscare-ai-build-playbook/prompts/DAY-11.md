# Prompt Hari 11 — Lengkapi API conventions, validation, CORS, CSRF, rate limit, dan RBAC context

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 11/50 — LENGKAPI API CONVENTIONS, VALIDATION, CORS, CSRF, RATE LIMIT, DAN RBAC CONTEXT
PHASE: API dan Auth

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/05-api/ENDPOINTS.md
- docs/05-api/ERROR-CONTRACT.md
- docs/08-security/SECURITY-CHECKLIST.md
- docs/05-api/ERROR-CONTRACT.md
- docs/14-ai-build-playbook/progress/DAY-10-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Buat route modules, dependency injection/context, typed success/error response, request parsing, pagination envelope, dan request ID propagation.
2. 10:15–12:15 — Implement Zod validation middleware, sanitized errors, security headers, explicit CORS origin allowlist, dan credential handling.
3. 13:15–15:15 — Implement CSRF strategy untuk state-changing cookie-auth requests, rate limiter interface/storage, dan trusted proxy configuration.
4. 15:30–17:30 — Implement session loader dan RBAC/permission guard skeleton; tulis middleware tests termasuk origin, CSRF, dan error cases.

DELIVERABLE WAJIB:
- API conventions
- Validation/error middleware
- CORS/CSRF/rate limit
- Session/RBAC context

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/middleware
- apps/api/src/http
- packages/contracts/src/http.ts
- apps/api/tests/middleware_test.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Origin wildcard tidak dipakai dengan credentials
- State-changing request terlindungi CSRF
- Validation error konsisten
- Permission default-deny

EXTERNAL GATE:
- Tidak ada external gate khusus. Gunakan provider fake yang sudah ada bila layanan luar belum dikonfigurasi.

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
- deno task test:api
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-11-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 12.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-11-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
