# Prompt Hari 48 — Security, observability, backup/restore, dan operational runbooks

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 48/50 — SECURITY, OBSERVABILITY, BACKUP/RESTORE, DAN OPERATIONAL RUNBOOKS
PHASE: Hardening dan rilis

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/08-security/SECURITY-CHECKLIST.md
- docs/11-deployment/DENO-DEPLOY-NEON.md
- docs/08-security/SECURITY-CHECKLIST.md
- docs/11-deployment/DENO-DEPLOY-NEON.md
- docs/14-ai-build-playbook/progress/DAY-47-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Threat-model auth/payment/upload/IDOR/webhook/SSE/tracking/admin; remediate high risks, headers, CSRF, CORS, rate limit, validation, and authorization.
2. 10:15–12:15 — Audit dependency/secrets/log redaction, cookie flags, token handling, upload controls, CSP, and production error responses.
3. 13:15–15:15 — Implement structured logs, health/readiness, metrics/alerts for errors, latency, webhook failures, email failures, outbox backlog, and stock anomalies.
4. 15:30–17:30 — Document and rehearse Neon backup/restore or branch-based recovery, migration rollback/forward, incident response, and provider outage runbooks.

DELIVERABLE WAJIB:
- Threat model/remediation
- Observability and alerts
- Backup/restore rehearsal
- Operational runbooks

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- docs/security/THREAT-MODEL.md
- docs/runbooks
- apps/api/src/observability
- apps/worker/src/observability

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- No known high-severity finding open
- Secrets absent from logs/repo
- Restore exercise evidenced
- Critical alerts have owner/action

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
- deno task audit
- deno task test:security
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-48-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 49.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-48-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
