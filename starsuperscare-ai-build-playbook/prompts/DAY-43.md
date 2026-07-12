# Prompt Hari 43 — Admin orders, payments, invoices, dan customers

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 43/50 — ADMIN ORDERS, PAYMENTS, INVOICES, DAN CUSTOMERS
PHASE: Operasional dan purnajual

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/admin/README.md
- docs/05-api/ENDPOINTS.md
- docs/08-security/SECURITY-CHECKLIST.md
- docs/14-ai-build-playbook/progress/DAY-42-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement admin order list/detail filters, status timeline, customer snapshot, items, totals, payment, shipment, invoice, and support links.
2. 10:15–12:15 — Implement permitted operations: mark processing, attach shipment, cancel rules, resend invoice, retry job, without editing immutable financial snapshot arbitrarily.
3. 13:15–15:15 — Implement payment events/invoice/customer list/detail with least-privilege data masking and no password/session secret exposure.
4. 15:30–17:30 — Bangun admin UI, audit all state changes, and authorization/status-transition tests.

DELIVERABLE WAJIB:
- Admin order operations
- Payment/invoice views
- Customer operations
- Audit/authorization tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/modules/admin/orders
- apps/admin/src/features/orders
- apps/admin/src/features/customers
- apps/admin/src/features/payments

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Status transitions validated server-side
- Sensitive data masked
- Financial snapshot not silently editable
- Every action has actor/audit

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
- deno task test:admin-api
- deno task test:admin
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-43-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 44.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-43-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
