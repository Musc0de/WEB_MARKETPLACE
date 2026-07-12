# Prompt Hari 50 — Production release, smoke test, rollback readiness, dan handover

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 50/50 — PRODUCTION RELEASE, SMOKE TEST, ROLLBACK READINESS, DAN HANDOVER
PHASE: Hardening dan rilis

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- IMPLEMENTATION-CHECKLIST.md
- docs/11-deployment/DENO-DEPLOY-NEON.md
- IMPLEMENTATION-CHECKLIST.md
- docs/14-ai-build-playbook/progress/DAY-49-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Review release diff, dependency lock, secrets, database migration, backup/restore point, feature flags, provider production settings, and change approval.
2. 10:15–12:15 — Run production migration with logs, deploy API and worker, verify health, then deploy storefront/auth/dashboard/admin/tracking and public site as applicable.
3. 13:15–15:15 — Run production smoke: login, products, cart, provider-approved controlled payment verification, webhook, invoice, email, activation, dashboard, admin, tracking, notification. Jangan memakai sandbox credential pada production.
4. 15:30–17:30 — Monitor errors/latency/outbox/webhooks/email, execute rollback if thresholds breached, finalize release notes, handover docs, and 24-hour observation checklist.

DELIVERABLE WAJIB:
- Production release
- Smoke evidence
- Rollback readiness
- Final handover and post-launch checklist

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- docs/releases/PRODUCTION-1.0.0.md
- docs/operations/HANDOVER.md
- docs/operations/POST-LAUNCH-CHECKLIST.md

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Migration/deploy evidence tersimpan
- Critical smoke checks pass
- Monitoring aktif
- Known limitations documented with owners

EXTERNAL GATE:
- Production credentials dan explicit change approval diperlukan. Jangan pernah menguji transaksi riil tanpa prosedur pembayaran aman yang disetujui.

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
- deno task quality
- deno task build
- deno task test:smoke:production
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-50-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 50.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-50-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
