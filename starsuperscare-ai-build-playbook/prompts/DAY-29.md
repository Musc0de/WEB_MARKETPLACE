# Prompt Hari 29 — Checkout address/shipping/review, order snapshot, dan stock reservation

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 29/50 — CHECKOUT ADDRESS/SHIPPING/REVIEW, ORDER SNAPSHOT, DAN STOCK RESERVATION
PHASE: Cart, Checkout, Payment

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/03-storefront/CHECKOUT.md
- docs/03-storefront/CHECKOUT.md
- docs/03-storefront/CHECKOUT.md
- docs/14-ai-build-playbook/progress/DAY-28-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement address validation/persistence and guest address input, shipping option adapter dengan deterministic mock, serta digital-only no-shipping branch.
2. 10:15–12:15 — Implement checkout validate/shipping-options endpoints dan server recomputation untuk product, stock, price, voucher, shipping, tax, total.
3. 13:15–15:15 — Implement POST /checkout/orders dengan idempotency key, immutable order/address/item snapshot, dan inventory reservation expiry.
4. 15:30–17:30 — Bangun address/shipping/review UI state machine, recovery after refresh, tests untuk mixed cart, stale price/stock, duplicate submit, and reservation release schedule.

DELIVERABLE WAJIB:
- Checkout validation
- Shipping adapter
- Idempotent order creation
- Inventory reservation and checkout UI

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/modules/checkout
- apps/api/src/modules/shipping
- apps/storefront/src/features/checkout

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Double-click tidak membuat dua order
- Digital-only tidak meminta shipping
- Order total dihitung server
- Reservation punya expiry dan release path

EXTERNAL GATE:
- Real shipping provider dapat ditambahkan nanti melalui adapter. Mock harus jelas hanya untuk development/test.

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
- deno task test:checkout
- deno task test:inventory
- deno task build:storefront
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-29-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 30.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-29-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
