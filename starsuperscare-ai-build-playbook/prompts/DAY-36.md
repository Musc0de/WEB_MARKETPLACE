# Prompt Hari 36 — Dashboard shell, route guards, navigation, dan home summary

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 36/50 — DASHBOARD SHELL, ROUTE GUARDS, NAVIGATION, DAN HOME SUMMARY
PHASE: Dashboard client

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/dashboard/README.md
- docs/04-dashboard/README.md
- docs/04-dashboard/README.md
- docs/14-ai-build-playbook/progress/DAY-35-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Bangun dashboard API client/session bootstrap, protected route guard, unauthorized/expired flow, error boundary, dan app layout.
2. 10:15–12:15 — Bangun desktop sidebar sesuai blueprint dan mobile nav Home/Orders/Cart/Notifications/Account; Cart link kembali ke shop.
3. 13:15–15:15 — Implement home summary endpoint dan UI: active orders, latest, shipping, total purchases, unread notification, unpaid status, recommendation link.
4. 15:30–17:30 — Tulis dashboard shell/home tests, loading/empty/error states, accessibility, and responsive build.

DELIVERABLE WAJIB:
- Protected dashboard shell
- Desktop/mobile navigation
- Home summary API/UI
- Dashboard baseline tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/dashboard/src/app
- apps/dashboard/src/features/home
- apps/api/src/modules/dashboard/home.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Unauthenticated diarahkan ke auth dengan safe return_to
- Cart tidak dipindah ke dashboard
- Total IDR server-derived
- Mobile nav sesuai blueprint

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
- deno task test:dashboard
- deno task build:dashboard
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-36-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 37.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-36-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
