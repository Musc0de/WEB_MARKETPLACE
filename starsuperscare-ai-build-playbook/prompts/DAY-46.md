# Prompt Hari 46 — Lengkapi unit/integration test, factories, dan coverage gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 46/50 — LENGKAPI UNIT/INTEGRATION TEST, FACTORIES, DAN COVERAGE GATE
PHASE: Hardening dan rilis

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/10-testing/TEST-PLAN.md
- docs/10-testing/TEST-PLAN.md
- docs/10-testing/TEST-PLAN.md
- docs/14-ai-build-playbook/progress/DAY-45-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Audit test coverage by domain and map every critical invariant/status transition to at least one test.
2. 10:15–12:15 — Lengkapi unit tests price/discount/sold/cart merge/voucher/order total/token expiry/permission/status transition.
3. 13:15–15:15 — Lengkapi integration tests auth/catalog/cart/reservation/payment/refund/outbox/invoice/notification/support menggunakan isolated test DB/branch.
4. 15:30–17:30 — Stabilkan factories, time/random/provider fakes, parallelization policy, coverage report, and fail threshold.

DELIVERABLE WAJIB:
- Critical unit coverage
- Integration coverage
- Deterministic factories/fakes
- Coverage gate

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- quality/unit
- quality/integration
- quality/fixtures
- deno.jsonc

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Tidak ada test bergantung urutan
- External provider dipalsukan deterministik
- Critical invariants covered
- Suite repeatable

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
- deno task test:unit
- deno task test:integration
- deno task test:coverage
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-46-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 47.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-46-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
