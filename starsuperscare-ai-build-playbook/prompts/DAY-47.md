# Prompt Hari 47 — E2E browser, accessibility, responsive, dan failure journeys

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 47/50 — E2E BROWSER, ACCESSIBILITY, RESPONSIVE, DAN FAILURE JOURNEYS
PHASE: Hardening dan rilis

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/10-testing/TEST-PLAN.md
- docs/10-testing/TEST-PLAN.md
- docs/14-ai-build-playbook/progress/DAY-46-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Set up E2E runner and isolated environment; seed deterministic user/products/payment mock and launch all required apps.
2. 10:15–12:15 — Automate guest product→cart→checkout→paid→invoice/account activation→login→dashboard order journey.
3. 13:15–15:15 — Automate signup/login/recovery, cart merge, wishlist, history pagination, notification reconnect, return, support, admin operations, and public tracking.
4. 15:30–17:30 — Run accessibility keyboard/focus/labels/contrast checks and desktop/mobile viewport suite; capture artifacts on failure.

DELIVERABLE WAJIB:
- Core E2E suite
- Failure journey tests
- Accessibility checks
- Responsive tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- quality/e2e
- quality/e2e/config
- scripts/start-test-stack.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Core purchase path tested in browser
- No test uses production secrets
- Failure artifacts retained
- Keyboard-only critical flows usable

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
- deno task test:e2e
- deno task test:a11y
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-47-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 48.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-47-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
