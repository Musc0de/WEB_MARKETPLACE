# Prompt Hari 03 — Scaffold lima aplikasi React + Vite

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 03/50 — SCAFFOLD LIMA APLIKASI REACT + VITE
PHASE: Fondasi repository

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- DIRECTORY-TREE.md
- apps/storefront/README.md
- apps/auth/README.md
- apps/dashboard/README.md
- apps/admin/README.md
- docs/01-architecture/SUBDOMAINS-AND-ROUTES.md
- docs/14-ai-build-playbook/progress/DAY-02-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Scaffold storefront, auth, dashboard, admin, dan tracking sebagai React + Vite + TypeScript tanpa mengubah nama folder blueprint.
2. 10:15–12:15 — Tambahkan router, App shell minimal, not-found page, error boundary, loading state, dan konfigurasi base URL per aplikasi.
3. 13:15–15:15 — Hubungkan packages/ui dan packages/config secara minimal; tampilkan halaman identitas aplikasi agar setiap dev server mudah dibedakan.
4. 15:30–17:30 — Jalankan type-check dan build untuk kelima aplikasi, perbaiki masalah dependency/workspace, lalu tulis petunjuk dev.

DELIVERABLE WAJIB:
- Lima frontend dapat berjalan
- Routing shell
- Error boundary dan 404
- Build frontend baseline

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/storefront/src
- apps/auth/src
- apps/dashboard/src
- apps/admin/src
- apps/tracking/src

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Tidak ada fitur ditempatkan pada aplikasi yang salah
- Semua app memakai strict TypeScript
- Base API berasal dari env tervalidasi
- Build kelima app berhasil

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
- deno task build:frontends
- deno task check
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-03-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 04.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-03-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
