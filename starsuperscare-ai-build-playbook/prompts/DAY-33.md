# Prompt Hari 33 — Akun otomatis setelah guest payment dan claim order aman

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 33/50 — AKUN OTOMATIS SETELAH GUEST PAYMENT DAN CLAIM ORDER AMAN
PHASE: Worker, Invoice, Notification

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md
- docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md
- docs/14-ai-build-playbook/progress/DAY-32-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement paid-order handler: bila guest email belum memiliki user, buat pending_activation user/profile dan activation token dalam transaksi idempotent.
2. 10:15–12:15 — Bila email sudah terkait akun, jangan auto-link hanya dari input guest; buat secure claim/notification flow yang memverifikasi kepemilikan.
3. 13:15–15:15 — Hubungkan activation UI/API ke pending order claim, username selection, password creation, verified email, session issue, dan redirect dashboard order.
4. 15:30–17:30 — Tulis duplicate paid event, existing account, expired token, conflicting username, replay, and order-ownership tests.

DELIVERABLE WAJIB:
- Auto-account worker handler
- Secure order claim
- Activation-to-dashboard flow
- Provisioning tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/worker/src/jobs/provision-account.ts
- apps/api/src/modules/auth/order-claim.ts
- apps/auth/src/features/activation

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Akun hanya dibuat setelah payment verified
- Tidak ada password via email
- Event ulang tidak membuat akun ganda
- Order tidak ditautkan ke akun salah

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
- deno task test:auto-account
- deno task test:auth
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-33-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 34.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-33-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
