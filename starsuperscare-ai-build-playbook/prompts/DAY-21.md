# Prompt Hari 21 — Storefront shell, design system, API client, dan goey-toast wrapper

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 21/50 — STOREFRONT SHELL, DESIGN SYSTEM, API CLIENT, DAN GOEY-TOAST WRAPPER
PHASE: Storefront

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/storefront/README.md
- packages/ui/README.md
- docs/07-ui/GOOEY-TOAST.md
- docs/07-ui/GOOEY-TOAST.md
- docs/14-ai-build-playbook/progress/DAY-20-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Bangun design tokens, typography, spacing, buttons, forms, cards, skeleton, dialog, pagination, badge, dan responsive containers di packages/ui.
2. 10:15–12:15 — Buat wrapper goey-toast terstandar untuk success/error/warning/info/promise, reduced-motion support, dan pesan Indonesia yang konsisten.
3. 13:15–15:15 — Bangun storefront header/nav/search/cart/account shell, API client typed, currency/date/sold formatter, dan error boundary.
4. 15:30–17:30 — Buat component tests/smoke page, audit keyboard/focus, dan build storefront baseline.

DELIVERABLE WAJIB:
- Shared UI foundation
- Goey-toast wrapper
- Storefront shell
- Formatter helpers

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- packages/ui/src
- apps/storefront/src/app
- apps/storefront/src/lib/api.ts
- packages/ui/src/toast.tsx

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Toast bukan pengganti persistent notification
- Reduced motion dihormati
- Currency IDR tanpa floating point
- Komponen keyboard-accessible

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
- deno task test:ui
- deno task build:storefront
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-21-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 22.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-21-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
