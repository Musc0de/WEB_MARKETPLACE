# Prompt Hari 04 — Scaffold Hono API dan worker internal

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 04/50 — SCAFFOLD HONO API DAN WORKER INTERNAL
PHASE: Fondasi repository

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/api/README.md
- docs/04-dashboard/NOTIFICATIONS.md
- docs/05-api/ERROR-CONTRACT.md
- docs/01-architecture/REQUEST-FLOW.md
- docs/14-ai-build-playbook/progress/DAY-03-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Buat composition root Hono, route /health dan /ready, version prefix /v1, serta server entrypoint untuk Deno.
2. 10:15–12:15 — Buat request ID, structured logger, error envelope, not-found handler, dan exception handler tanpa membocorkan stack production.
3. 13:15–15:15 — Buat worker entrypoint, lifecycle, graceful shutdown, polling interface kosong, dan health logging; worker bukan HTTP app publik.
4. 15:30–17:30 — Tambahkan unit smoke test API/worker, jalankan lokal, dan dokumentasikan permission Deno minimum.

DELIVERABLE WAJIB:
- Hono API baseline
- Worker baseline
- Error contract
- Health/readiness tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/main.ts
- apps/api/src/app.ts
- apps/api/src/middleware
- apps/worker/src/main.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- GET /health memberi respons stabil
- Error contract seragam
- Worker dapat start/stop bersih
- Tidak ada koneksi DB dari frontend

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
- deno task dev:api
- deno task test:api
- deno task check
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-04-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 05.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-04-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
