# Prompt Hari 30 — Payment adapter, verified webhook, dan Checkout Gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 30/50 — PAYMENT ADAPTER, VERIFIED WEBHOOK, DAN CHECKOUT GATE
PHASE: Cart, Checkout, Payment

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/03-storefront/CHECKOUT.md
- docs/05-api/ENDPOINTS.md
- docs/10-testing/TEST-PLAN.md
- docs/14-ai-build-playbook/progress/DAY-29-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Definisikan PaymentProvider interface dan implement deterministic sandbox/mock provider tanpa menyimpan raw card data.
2. 10:15–12:15 — Implement create payment intent/session, payment page handoff, pending/success/failed UI, dan provider reference persistence.
3. 13:15–15:15 — Implement webhook signature verification contract, unique provider event, state transition validation, transaction order paid + reservation commit + outbox.
4. 15:30–17:30 — Tulis duplicate/out-of-order/invalid-signature tests, browser-success-not-source-of-truth test, quality gate, dan Checkout Gate report.

DELIVERABLE WAJIB:
- Payment provider abstraction
- Payment flow UI/API
- Idempotent verified webhook
- Checkout gate report

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/modules/payments
- apps/api/src/routes/v1/webhooks.ts
- apps/storefront/src/features/checkout/payment

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Order paid hanya lewat event terverifikasi
- Duplicate webhook aman
- Invalid signature ditolak
- Raw payment secret/card data tidak dilog

EXTERNAL GATE:
- Pilih dan siapkan payment gateway sandbox untuk integrasi nyata. Sampai tersedia, mock provider harus mencakup success, pending, failed, duplicate, dan invalid webhook.

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
- deno task test:payments
- deno task test:checkout
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-30-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 31.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-30-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
