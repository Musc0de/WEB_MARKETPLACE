# Prompt Hari 45 — Public tracking, shipment events, dan Operations Gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

```text
KERJAKAN DAY 45/50 — PUBLIC TRACKING, SHIPMENT EVENTS, DAN OPERATIONS GATE
PHASE: Operasional dan purnajual

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/01-architecture/SUBDOMAINS-AND-ROUTES.md
- docs/04-dashboard/ORDERS-HISTORY-INVOICES.md
- docs/01-architecture/SUBDOMAINS-AND-ROUTES.md
- docs/14-ai-build-playbook/progress/DAY-44-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Implement opaque public tracking token issue/revoke/expiry and endpoint projection that exposes only safe shipment/order fields.
2. 10:15–12:15 — Implement shipment provider adapter/webhook or deterministic mock, unique event handling, timeline ordering, and order notification outbox.
3. 13:15–15:15 — Bangun tracking app with token route, invalid/expired/not-found states, timeline, estimated delivery, and no account PII.
4. 15:30–17:30 — Run operations integration tests, security review tracking enumeration, build admin/dashboard/tracking, and write Operations Gate report.

DELIVERABLE WAJIB:
- Public tracking token/API
- Shipment event adapter
- Tracking frontend
- Operations gate report

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/api/src/modules/tracking
- apps/api/src/modules/shipping/webhook.ts
- apps/tracking/src

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Order ID mentah bukan public credential
- Token sulit ditebak dan revocable
- Payload tidak memuat email/alamat lengkap
- Duplicate shipping event idempotent

EXTERNAL GATE:
- Real courier integration dapat mengganti mock adapter setelah akun provider dan webhook secret tersedia.

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
- deno task test:tracking
- deno task build:tracking
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-45-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 46.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-45-REPORT.md
```

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
