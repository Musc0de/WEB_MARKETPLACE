# Prompt Hari 10 — Implement purnajual, notifikasi, outbox, audit, seed, dan DB gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 10/50 — IMPLEMENT PURNAJUAL, NOTIFIKASI, OUTBOX, AUDIT, SEED, DAN DB GATE
PHASE: Neon dan schema

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/04-dashboard/NOTIFICATIONS.md
- docs/06-database/SCHEMA.md
- docs/06-database/SCHEMA.md
- database/migrations/README.md
- docs/14-ai-build-playbook/progress/DAY-09-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Model returns, return_items, refunds, support tickets/messages, attachments metadata, dan verified-purchase reviews.
2. 10:15–12:15 — Model notifications dengan read_at, notification deliveries, outbox events, job attempts, audit logs, serta idempotency keys.
3. 13:15–15:15 — Buat seed roles/permissions/admin development/category/product/stock; buat data factory dan reset strategy khusus non-production.
4. 15:30–17:30 — Jalankan migration dari database kosong, seed, schema assertions, dan DB gate report; perbaiki seluruh masalah constraint/index.

DELIVERABLE WAJIB:
- Purnajual/support schema
- Notification/outbox schema
- Audit/idempotency schema
- Repeatable migrations and seeds

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- packages/database/src/schema/aftercare.ts
- packages/database/src/schema/notifications.ts
- packages/database/src/schema/audit.ts
- database/seeds/*

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Migration fresh database berhasil
- Seed idempotent atau reset-safe
- read/unread hanya bersumber dari read_at
- Outbox siap diproses idempotent

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
- deno task db:reset:dev
- deno task db:migrate
- deno task db:seed
- deno task test:db
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-10-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 11.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-10-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
