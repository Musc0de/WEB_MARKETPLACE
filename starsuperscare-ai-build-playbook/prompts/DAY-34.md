# Prompt Hari 34 — Persistent notifications, read/unread API, dan SSE

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 34/50 — PERSISTENT NOTIFICATIONS, READ/UNREAD API, DAN SSE
PHASE: Worker, Invoice, Notification

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/04-dashboard/NOTIFICATIONS.md
- docs/04-dashboard/NOTIFICATIONS.md
- docs/14-ai-build-playbook/progress/DAY-33-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement notification creation handlers dari business outbox dengan dedupe_key, user ownership, type, data payload version, dan created_at.
2. 10:15–12:15 — Implement list/pagination/unread-count/read/read-all endpoints; status hanya derived dari read_at.
3. 13:15–15:15 — Implement authenticated SSE stream dengan heartbeat, reconnect guidance, bounded resources, last event cursor/refresh strategy, dan authorization.
4. 15:30–17:30 — Tulis SSE/read tests termasuk disconnect/reconnect, unauthorized stream, duplicate events, and database-source-of-truth behavior.

DELIVERABLE WAJIB:
- Notification worker handlers
- Read/unread REST API
- Authenticated SSE
- Notification tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/worker/src/jobs/notifications.ts
- apps/api/src/modules/notifications
- apps/api/src/routes/v1/notifications.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- SSE bukan satu-satunya source
- User tidak menerima notifikasi user lain
- read_at konsisten
- Reconnect tidak menggandakan persistent records

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
- deno task test:notifications
- deno task test:worker
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-34-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 35.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-34-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
