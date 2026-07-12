# Daily Operating Procedure

## Aturan pelaksanaan untuk AI coding agent

1. Baca file sumber yang disebut pada prompt hari itu sebelum mengubah kode.
2. Audit kode yang sudah ada; jangan menimpa pekerjaan hari sebelumnya secara membabi buta.
3. Kerjakan hanya scope hari itu dan shared prerequisite yang benar-benar diperlukan.
4. Jangan mengubah domain, batas aplikasi, database ownership, atau flow akun tanpa ADR baru.
5. Gunakan TypeScript strict; hindari `any`, non-null assertion, dan cast yang tidak dibuktikan.
6. Semua input eksternal divalidasi server-side dengan kontrak Zod. Client validation hanya untuk UX.
7. Semua nilai uang disimpan sebagai integer rupiah. Jangan memakai floating-point untuk total finansial.
8. Semua waktu disimpan UTC; UI memakai `id-ID` dan `Asia/Jakarta`.
9. Frontend tidak boleh memegang database URL, provider secret, session ID, atau raw payment data.
10. Password disimpan sebagai hash kuat; token sekali pakai disimpan sebagai digest; password tidak pernah dikirim lewat email.
11. Gunakan session cookie `Secure`, `HttpOnly`, host-only untuk API, explicit CORS credentials, CSRF protection, dan authorization default-deny.
12. Gunakan `goey-toast` untuk feedback aksi UI; notifikasi persisten tetap berasal dari database.
13. Payment/shipping/email/storage harus memakai adapter. Bila credential belum tersedia, buat deterministic fake untuk development/test dan dokumentasikan gap; jangan mengklaim integrasi nyata berhasil.
14. Jangan hanya menjelaskan. Edit file repository, tambahkan test, jalankan command, dan tunjukkan hasil nyata.
15. Jangan mengarang hasil command. Bila gagal, tampilkan error ringkas, perbaiki semampunya, lalu catat blocker yang tersisa.
16. Akhiri setiap hari dengan laporan di `docs/14-ai-build-playbook/progress/DAY-XX-REPORT.md` berisi perubahan, migration, env baru, command + hasil, risiko, blocker, dan handoff hari berikutnya.

## Ritme 8 jam

### 08:00–10:00 — Inspect dan design

- Baca dokumen sumber.
- Periksa `git status`, diff, migration history, test failures, dan laporan hari sebelumnya.
- Buat rencana perubahan file dan dependency.
- Jangan mulai dengan refactor luas yang tidak terkait scope.

### 10:15–12:15 — Core implementation

- Implement business/domain/database/API core hari itu.
- Tambahkan contract dan migration bersamaan dengan kode.
- Pertahankan transaction boundary dan idempotency.

### 13:15–15:15 — Integration dan UI

- Integrasikan layer lain yang berada dalam scope hari itu.
- Tambahkan error/loading/empty state.
- Tambahkan unit/integration/component test.

### 15:30–17:30 — Verify, review, report

- Jalankan formatter, linter, type-check, tests, dan build yang relevan.
- Review security, ownership, PII, log redaction, dan migration.
- Perbaiki failure.
- Tulis DAY-XX-REPORT dan commit hanya setelah review manusia.

## Checklist review manusia sebelum menerima output AI

- Buka `git diff --stat` dan `git diff`.
- Pastikan AI tidak menghapus atau memindahkan route/domain.
- Pastikan migration tidak destructive tanpa alasan.
- Pastikan env baru masuk `.env.example`, bukan `.env` nyata.
- Pastikan test benar-benar dijalankan, bukan hanya ditulis.
- Pastikan frontend tidak import `packages/database`.
- Pastikan API authorization tidak hanya bergantung pada ID dari URL.
- Pastikan semua nominal integer dan timestamp UTC.
- Commit kecil dengan pesan yang menjelaskan outcome, bukan aktivitas.
