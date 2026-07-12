# Definition of Done

## Satu task selesai bila

- Scope sesuai prompt dan tidak menggeser arsitektur.
- Kode production dan error path tersedia.
- Input eksternal tervalidasi.
- Authentication/authorization diterapkan bila diperlukan.
- Unit/integration/component test relevan ditambahkan.
- Formatter, lint, type-check, tests, dan build terkait lulus.
- Migration/seed dapat dijalankan dari keadaan yang terdokumentasi.
- Env baru ditambahkan ke `.env.example` tanpa secret.
- Logging tidak memuat password, token, raw payment data, atau PII berlebihan.
- Dokumentasi dan laporan hari diperbarui.

## Satu phase gate selesai bila

- Semua acceptance criteria hari-hari phase terpenuhi.
- Happy path dan failure path kritis teruji.
- Tidak ada blocker severity tinggi yang disembunyikan.
- Database migration diuji pada database/branch bersih.
- Build seluruh app terdampak berhasil.
- Review manusia menyetujui diff.

## Tidak boleh disebut selesai bila

- AI hanya memberikan contoh tetapi tidak mengedit repository.
- Test belum dijalankan.
- Integrasi provider masih fake tetapi dilabeli production-ready.
- Secret hard-coded.
- Authorization hanya dilakukan di UI.
- Nominal finansial dihitung dari nilai client.
- Webhook tidak diverifikasi atau tidak idempotent.
- Migration destructive tidak mempunyai rollout/rollback plan.
