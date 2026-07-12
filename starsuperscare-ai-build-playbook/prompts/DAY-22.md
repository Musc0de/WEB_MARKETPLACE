# Prompt Hari 22 — Product list dan product card final

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 22/50 — PRODUCT LIST DAN PRODUCT CARD FINAL
PHASE: Storefront

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/03-storefront/PRODUCTS.md
- docs/03-storefront/PRODUCTS.md
- docs/14-ai-build-playbook/progress/DAY-21-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Bangun /products data loader/query state dan URL pagination per_page=12 dengan cancellation serta cache policy sederhana.
2. 10:15–12:15 — Bangun ProductCard berisi image, name, brand, category, regular/selling price, discount, rating, review count, net sold, stock, badges, dan wishlist state.
3. 13:15–15:15 — Implement add-to-cart/buy-now/wishlist action stubs yang terhubung kontrak, responsive grid, skeleton, empty/error/out-of-stock states.
4. 15:30–17:30 — Tulis component/integration tests untuk sold label, price discount, stock, new badge, action accessibility, dan mobile layout.

DELIVERABLE WAJIB:
- Products page
- Final ProductCard
- Responsive states
- Product card tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/storefront/src/features/catalog/pages/ProductsPage.tsx
- apps/storefront/src/features/catalog/components/ProductCard.tsx

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Tampilan memuat Terjual dan Stok
- Terjual 0 dapat diganti Baru sesuai rule
- Harga normal/promo jelas
- Out-of-stock mencegah CTA invalid

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
- deno task test:storefront
- deno task build:storefront
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-22-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 23.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-22-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
