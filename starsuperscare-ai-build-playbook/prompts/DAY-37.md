# Prompt Hari 37 — Profile, security, sessions, addresses, dan payment method metadata

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 37/50 — PROFILE, SECURITY, SESSIONS, ADDRESSES, DAN PAYMENT METHOD METADATA
PHASE: Dashboard client

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/04-dashboard/README.md
- docs/04-dashboard/README.md
- docs/04-dashboard/README.md
- docs/14-ai-build-playbook/progress/DAY-36-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement GET/PATCH /me dan profile UI untuk name, email display/policy, phone, avatar metadata, joined date, and validation.
2. 10:15–12:15 — Implement change password, sessions list, revoke one/all other sessions, login history summary, and security feedback.
3. 13:15–15:15 — Implement addresses CRUD/default shipping/billing with ownership and dashboard UI.
4. 15:30–17:30 — Implement tokenized payment-method metadata list/delete only if provider supports it; no raw card data; test ownership and responsive forms.

DELIVERABLE WAJIB:
- Profile UI/API
- Security/session management
- Address CRUD
- Payment method metadata

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/dashboard/src/features/profile
- apps/dashboard/src/features/addresses
- apps/dashboard/src/features/payment-methods
- apps/api/src/modules/me

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Password lama diverifikasi
- Password tidak ditampilkan
- Session revoke efektif
- Card PAN/CVV tidak tersimpan

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
- deno task test:auth
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-37-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 38.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-37-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
