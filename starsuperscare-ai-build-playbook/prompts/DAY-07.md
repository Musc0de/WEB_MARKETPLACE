# Prompt Hari 07 — Implement identity, role, profile, address, dan session schema

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 07/50 — IMPLEMENT IDENTITY, ROLE, PROFILE, ADDRESS, DAN SESSION SCHEMA
PHASE: Neon dan schema

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/06-database/SCHEMA.md
- docs/02-auth/LOGIN-SIGNUP-FLOWS.md
- docs/06-database/SCHEMA.md
- docs/14-ai-build-playbook/progress/DAY-06-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Model users, profiles, password credentials, roles, permissions, mappings, dan status lifecycle dengan constraint yang jelas.
2. 10:15–12:15 — Model sessions, login attempts, verification/reset/activation tokens; simpan token digest, expiry, used/revoked timestamps.
3. 13:15–15:15 — Model addresses dengan type shipping/billing, primary flags, ownership, dan normalisasi field Indonesia tanpa mengunci provider wilayah.
4. 15:30–17:30 — Buat migration, schema tests untuk unique/index/FK, factory data, dan review keamanan field sensitif.

DELIVERABLE WAJIB:
- Identity schema
- Session/token schema
- RBAC schema
- Address schema dan tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- packages/database/src/schema/identity.ts
- packages/database/src/schema/rbac.ts
- packages/database/src/schema/addresses.ts
- migrations/*

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Username dan normalized email unik
- Password plaintext tidak memiliki kolom
- Token hanya disimpan sebagai hash/digest
- Session dapat direvoke per perangkat

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
- deno task db:generate
- deno task db:migrate
- deno task test:db
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-07-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 08.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-07-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
