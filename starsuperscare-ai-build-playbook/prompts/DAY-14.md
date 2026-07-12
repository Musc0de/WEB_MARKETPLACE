# Prompt Hari 14 — Forgot/reset password, activation, dan return_to allowlist

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 14/50 — FORGOT/RESET PASSWORD, ACTIVATION, DAN RETURN_TO ALLOWLIST
PHASE: API dan Auth

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/02-auth/LOGIN-SIGNUP-FLOWS.md
- docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md
- docs/02-auth/LOGIN-SIGNUP-FLOWS.md
- docs/14-ai-build-playbook/progress/DAY-13-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement forgot-password generic response, reset token issuance, expiry/reuse prevention, password replacement, dan optional revoke-all sessions.
2. 10:15–12:15 — Implement account activation endpoint untuk pending guest account: token verification, username final, password creation, email verification, dan activation audit.
3. 13:15–15:15 — Implement return_to parser dengan allowlist host/path, anti-open-redirect, dan safe default dashboard home.
4. 15:30–17:30 — Tulis integration tests untuk expired/reused token, reset unknown email, activation conflict, session revocation, dan malicious return_to.

DELIVERABLE WAJIB:
- Password recovery API
- Account activation API
- Safe return_to
- Recovery/activation tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/modules/auth/recovery.ts
- apps/api/src/modules/auth/activation.ts
- packages/auth/src/return-to.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Response forgot password tetap generik
- Aktivasi tidak mengirim password
- Token one-time dan hashed
- Open redirect ditolak

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
- deno task test:api
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-14-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 15.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-14-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
