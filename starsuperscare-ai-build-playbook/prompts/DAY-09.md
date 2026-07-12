# Prompt Hari 09 — Implement cart, order, payment, invoice, shipment, dan digital schema

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 09/50 — IMPLEMENT CART, ORDER, PAYMENT, INVOICE, SHIPMENT, DAN DIGITAL SCHEMA
PHASE: Neon dan schema

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/03-storefront/CART.md
- docs/03-storefront/CHECKOUT.md
- docs/06-database/SCHEMA.md
- docs/06-database/SCHEMA.md
- docs/14-ai-build-playbook/progress/DAY-08-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Model carts/cart_items untuk guest token hash atau user, active-cart uniqueness, selected/save-for-later state, dan price observation.
2. 10:15–12:15 — Model orders/order_items/order_addresses sebagai immutable snapshot, order number, amount breakdown integer, status transitions, dan idempotency link.
3. 13:15–15:15 — Model payments/payment_events, provider IDs, invoices, shipments/events, vouchers/redemptions, serta customer payment method token metadata.
4. 15:30–17:30 — Model digital assets dan entitlements/download limits; buat migration, index, FK policy, dan schema tests.

DELIVERABLE WAJIB:
- Cart schema
- Order snapshot schema
- Payment/invoice/shipment schema
- Digital entitlement schema

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- packages/database/src/schema/cart.ts
- packages/database/src/schema/orders.ts
- packages/database/src/schema/payments.ts
- packages/database/src/schema/digital.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Order item tetap terbaca meski produk berubah
- Provider event ID unik
- Tidak ada raw card data
- Guest cart dan account cart dapat dibedakan aman

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
- deno task db:generate
- deno task db:migrate
- deno task test:db
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-09-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 10.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-09-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
