# Prompt Hari 13 — Login username/password, session, logout, dan audit

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 13/50 — LOGIN USERNAME/PASSWORD, SESSION, LOGOUT, DAN AUDIT
PHASE: API dan Auth

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/02-auth/LOGIN-SIGNUP-FLOWS.md
- docs/08-security/SECURITY-CHECKLIST.md
- packages/auth/README.md
- docs/14-ai-build-playbook/progress/DAY-12-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement POST /auth/login dengan username normalized, generic credential error, throttling, account-status checks, dan audit login.
2. 10:15–12:15 — Implement opaque session ID, database digest, expiry/idle timeout, rotation, Secure HttpOnly host-only cookie pada API, dan GET /session.
3. 13:15–15:15 — Implement logout current, logout-all, session listing/revocation primitives, serta cleanup query untuk worker.
4. 15:30–17:30 — Tulis tests untuk valid/invalid login, lock/rate limit, cookie flags, session rotation, revoked/expired session, dan cross-origin credential flow.

DELIVERABLE WAJIB:
- Login API
- Session lifecycle
- Logout/logout-all
- Login audit and tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- packages/auth/src/session.ts
- apps/api/src/modules/auth/login.ts
- apps/api/src/modules/auth/session.ts
- apps/api/tests/auth_session_test.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Cookie tidak dapat dibaca JavaScript
- Session ID tidak disimpan plaintext
- Pesan login tidak melakukan user enumeration
- Revoked session langsung ditolak

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
2. File `docs/14-ai-build-playbook/progress/DAY-13-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 14.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-13-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
