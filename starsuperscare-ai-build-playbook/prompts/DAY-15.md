# Prompt Hari 15 — Bangun aplikasi auth dan selesaikan Auth Gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 15/50 — BANGUN APLIKASI AUTH DAN SELESAIKAN AUTH GATE
PHASE: API dan Auth

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/auth/README.md
- docs/02-auth/LOGIN-SIGNUP-FLOWS.md
- docs/02-auth/LOGIN-SIGNUP-FLOWS.md
- docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md
- docs/07-ui/GOOEY-TOAST.md
- docs/14-ai-build-playbook/progress/DAY-14-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Bangun API client dengan credentials, CSRF bootstrap, typed errors, loading/cancellation, dan return_to handling.
2. 10:15–12:15 — Bangun halaman login dan signup dengan accessible forms, client validation yang sama kontraknya, password visibility, dan goey-toast.
3. 13:15–15:15 — Bangun verify-email, resend, forgot-password, reset-password, activation, logout result, dan invalid/expired token states.
4. 15:30–17:30 — Jalankan integration/E2E auth lokal, perbaiki responsive/accessibility, dan tulis Auth Gate report.

DELIVERABLE WAJIB:
- Auth frontend complete
- API integration
- Accessible feedback/toasts
- Auth gate report

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/auth/src/features/login
- apps/auth/src/features/signup
- apps/auth/src/features/recovery
- apps/auth/src/features/activation

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- User active dapat login menuju dashboard
- Semua form mempunyai label/error accessible
- Credentials dikirim hanya ke API resmi
- Build dan auth tests lulus

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
- deno task test:auth
- deno task build:auth
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-15-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 16.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-15-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
