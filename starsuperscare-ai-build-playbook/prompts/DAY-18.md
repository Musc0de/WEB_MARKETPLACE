# Prompt Hari 18 — Admin catalog UI dan upload assets

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 18/50 — ADMIN CATALOG UI DAN UPLOAD ASSETS
PHASE: Catalog dan Admin

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- apps/admin/README.md
- docs/03-storefront/PRODUCTS.md
- docs/08-security/SECURITY-CHECKLIST.md
- docs/14-ai-build-playbook/progress/DAY-17-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Bangun admin shell, auth guard, permission-aware navigation, product list, filters, empty/loading/error states.
2. 10:15–12:15 — Bangun create/edit product, category, brand, variant, price, digital/physical fields, validation, dan unsaved-change guard.
3. 13:15–15:15 — Implement object storage adapter/presigned upload flow untuk product image; validate MIME/size/ownership dan simpan metadata saja di Neon.
4. 15:30–17:30 — Integrasikan goey-toast, optimistic UI yang aman, upload progress, build/test, dan dokumentasikan provider storage env.

DELIVERABLE WAJIB:
- Admin product UI
- Variant/price forms
- Asset upload adapter
- Admin UI tests

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/admin/src/features/catalog
- apps/api/src/modules/assets
- packages/contracts/src/assets.ts

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Frontend tidak menerima storage secret
- Upload tervalidasi server
- Admin action mengikuti permission
- Form physical/digital conditional benar

EXTERNAL GATE:
- Object storage S3-compatible diperlukan untuk upload nyata. Bila belum ada, gunakan in-memory/local development adapter dan jangan memalsukan URL production.

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
- deno task build:admin
- deno task test:admin
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-18-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 19.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-18-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
