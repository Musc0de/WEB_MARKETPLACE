# Prompt Hari 35 — Commerce E2E, failure recovery, dan Integration Gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 35/50 — COMMERCE E2E, FAILURE RECOVERY, DAN INTEGRATION GATE
PHASE: Worker, Invoice, Notification

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/10-testing/TEST-PLAN.md
- docs/02-auth/AUTO-ACCOUNT-AFTER-PURCHASE.md
- docs/09-email/EMAIL-AND-INVOICE.md
- docs/14-ai-build-playbook/progress/DAY-34-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Buat integration fixture end-to-end: product aktif, guest cart, checkout, order pending, verified payment, stock commit, stats, outbox, invoice, email record, account pending.
2. 10:15–12:15 — Lanjutkan aktivasi, login, session, order ownership, notification, invoice access, dan digital entitlement bila item digital.
3. 13:15–15:15 — Tambahkan failure matrix: price/stock change, expired reservation, duplicate/out-of-order webhook, worker crash/retry, email fail, expired activation.
4. 15:30–17:30 — Jalankan seluruh integration suite dari database test bersih, perbaiki flakiness, dan tulis Integration Gate report.

DELIVERABLE WAJIB:
- Full commerce integration suite
- Failure/retry matrix
- Test fixtures
- Integration gate report

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- quality/integration/commerce_flow_test.ts
- quality/fixtures
- docs/14-ai-build-playbook/progress/DAY-35-REPORT.md

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Happy path berjalan tanpa manual DB edit
- Duplicate events tidak menggandakan side effect
- Failure dapat dipulihkan
- Test repeatable dari DB kosong

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
- deno task test:integration
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-35-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 36.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-35-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
