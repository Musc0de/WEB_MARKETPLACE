# Prompt Hari 44 — Admin review moderation, inventory operations, audit, dan operational dashboard

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 44/50 — ADMIN REVIEW MODERATION, INVENTORY OPERATIONS, AUDIT, DAN OPERATIONAL DASHBOARD
PHASE: Operasional dan purnajual

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/admin/README.md
- docs/08-security/SECURITY-CHECKLIST.md
- docs/14-ai-build-playbook/progress/DAY-43-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement review moderation queue with publish/reject policy, reason, audit, and aggregate recalculation.
2. 10:15–12:15 — Complete admin catalog/inventory operations including low stock, movement history, product status, and bulk action safeguards.
3. 13:15–15:15 — Build operational dashboard cards for orders/payments/outbox/email/low-stock using bounded queries and permission-aware metrics.
4. 15:30–17:30 — Build audit log viewer with filters/redaction, test admin boundaries, and responsive admin build.

DELIVERABLE WAJIB:
- Review moderation
- Inventory operations
- Operational metrics
- Audit log viewer

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/modules/admin/reviews
- apps/admin/src/features/reviews
- apps/admin/src/features/overview
- apps/admin/src/features/audit

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Moderation does not edit review content silently
- Bulk actions require explicit selection/confirmation
- Metrics do not leak PII
- Audit immutable to normal admin

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
- deno task test:admin
- deno task build:admin
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-44-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 45.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-44-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
