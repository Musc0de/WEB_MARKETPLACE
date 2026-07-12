# Prompt Hari 06 — Hubungkan Neon, Drizzle, dan migration tooling

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 06/50 — HUBUNGKAN NEON, DRIZZLE, DAN MIGRATION TOOLING
PHASE: Neon dan schema

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/06-database/NEON-CONNECTION.md
- packages/database/README.md
- database/migrations/README.md
- docs/14-ai-build-playbook/progress/DAY-05-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Siapkan konfigurasi Neon development/staging/production dan dokumentasikan pooled runtime URL versus direct migration URL.
2. 10:15–12:15 — Implement packages/database client untuk API/worker, Drizzle config untuk migration, serta pencegahan import database dari frontend.
3. 13:15–15:15 — Buat connection smoke test, transaction helper, UTC timestamp convention, dan integer-IDR helper boundaries.
4. 15:30–17:30 — Jalankan koneksi development, buat migration kosong pertama, cek secret hygiene, dan tulis panduan branch database.

DELIVERABLE WAJIB:
- Neon runtime client
- Drizzle migration config
- DB smoke test
- Environment matrix

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- packages/database/src/client.ts
- packages/database/drizzle.config.ts
- packages/database/src/transaction.ts
- scripts/db-smoke.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Runtime memakai pooled URL
- Migration memakai direct URL
- SSL diwajibkan
- DATABASE_URL hanya tersedia pada API/worker/migration

EXTERNAL GATE:
- Neon project dan connection strings development diperlukan untuk koneksi nyata. Bila belum ada, selesaikan adapter dan gunakan test yang di-skip dengan alasan eksplisit.

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
- deno task db:check
- deno task db:generate
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-06-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 07.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-06-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
