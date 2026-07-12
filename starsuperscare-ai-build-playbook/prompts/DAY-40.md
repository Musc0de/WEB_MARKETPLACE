# Prompt Hari 40 — Notifications, wishlist, reviews, settings, dan Dashboard Gate

Tempel `00-MASTER-PROMPT.md` satu kali pada project instruction, kemudian tempel blok berikut.

~~~text
KERJAKAN DAY 40/50 — NOTIFICATIONS, WISHLIST, REVIEWS, SETTINGS, DAN DASHBOARD GATE
PHASE: Dashboard client

Anda harus mengedit repository StarSuperScare yang sedang terbuka. Jangan hanya menjelaskan dan jangan membuat project baru di luar struktur saat ini.

BACA TERLEBIH DAHULU:
- docs/04-dashboard/README.md
- docs/04-dashboard/NOTIFICATIONS.md
- docs/04-dashboard/README.md
- docs/14-ai-build-playbook/progress/DAY-39-REPORT.md (bila Day > 01 dan file tersedia)

SCOPE HARI INI, URUT SESUAI BLOK KERJA:
1. 08:00–10:00 — Bangun notification center list/read/read-all/unread badge dan SSE listener dengan reconnect, REST refresh, and goey-toast for live events.
2. 10:15–12:15 — Bangun account wishlist page dengan stock/price projection, remove/add-cart/product links.
3. 13:15–15:15 — Implement eligible verified-purchase reviews list/create/edit/delete policy dan settings profile/security/notification/privacy shells.
4. 15:30–17:30 — Jalankan dashboard tests, accessibility/mobile audit, build, dan tulis Dashboard Gate report.

DELIVERABLE WAJIB:
- Notification center + SSE
- Wishlist dashboard
- Reviews lifecycle
- Settings and dashboard gate

FILE/FOLDER UTAMA YANG DIPERKIRAKAN BERUBAH:
- apps/dashboard/src/features/notifications
- apps/dashboard/src/features/wishlist
- apps/dashboard/src/features/reviews
- apps/dashboard/src/features/settings

ACCEPTANCE CRITERIA — JANGAN NYATAKAN SELESAI SEBELUM SEMUANYA DIBUKTIKAN:
- Toast live tidak menggantikan database record
- Review hanya untuk eligible order item
- Unread badge pulih setelah reconnect
- Semua route mobile usable

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
- deno task build:dashboard
- deno task quality
Tambahkan command lain yang relevan. Jangan mengarang hasil. Bila command gagal, perbaiki atau catat error nyata sebagai blocker.

OUTPUT WAJIB DI REPOSITORY:
1. Semua perubahan kode, test, migration, env example, dan dokumentasi yang diperlukan.
2. File `docs/14-ai-build-playbook/progress/DAY-40-REPORT.md` mengikuti template laporan harian.
3. Laporan harus memuat: ringkasan, file berubah, keputusan, migration, env baru, command yang dijalankan beserta PASS/FAIL, acceptance evidence, security review, blocker, technical debt, dan handoff Day 41.

RESPONS AKHIR ANDA HARUS RINGKAS DAN FAKTUAL:
- Outcome hari ini
- File utama berubah
- Migration/env changes
- Test/build commands dan hasil nyata
- Blocker yang belum selesai
- Path DAY-40-REPORT.md
~~~

## Checklist operator

- [ ] Master prompt sudah aktif.
- [ ] AI memiliki akses edit file dan terminal.
- [ ] Diff diperiksa manual.
- [ ] Tidak ada domain/route yang dipindahkan.
- [ ] Hasil command dapat diverifikasi.
- [ ] Laporan hari dibuat.
