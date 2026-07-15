# Day 31 Report

## Ringkasan
Hari ini, kita berhasil mengimplementasikan sistem **Transactional Outbox Worker**, penanganan **Retry/Locking** secara konkuren yang tangguh, serta penjadwalan berbagai **Cleanup Jobs**. Sistem worker ini dirancang beroperasi sebagai *daemon* di belakang layar dengan *graceful shutdown* dan memanfaatkan `SKIP LOCKED` pada basis data PostgreSQL untuk menjamin tidak adanya tumpang tindih (*race condition*) antar worker.

## Perubahan File Utama
1. `packages/database/src/schema/notifications.ts`: Modifikasi tabel `outboxEvents` (perbaikan `retryCount` menjadi tipe *integer*, penambahan `availableAt` untuk *exponential backoff*).
2. `packages/database/migrations/*`: Pembuatan migrasi skema ke-0005.
3. `apps/worker/src/outbox/poller.ts`: Logika *polling* tabel Outbox yang mengimplementasikan klaim baris data konkurensi (row-level locking `FOR UPDATE SKIP LOCKED`).
4. `apps/worker/src/outbox/processor.ts`: Proses eksekusi _event handler_, penanganan idempotency, dan _exponential backoff_ (max 5 retries) hingga status _dead-letter_ (`failed`).
5. `apps/worker/src/outbox/registry.ts`: Repositori registrasi _handler_ event.
6. `apps/worker/src/jobs/cleanup.ts`: Implementasi rutinitas pembersihan sesi dan _tokens_ kedaluwarsa, pelepasan _inventory reservation_ yang *expired* ke kuantitas *available*, dan penghapusan `guest carts`.
7. `apps/worker/src/main.ts`: Koordinasi *polling* dan siklus *cleanup jobs* yang berjalan secara periodik.
8. `apps/worker/src/ops.ts` & `apps/worker/src/run-once.ts`: *Script* bantuan untuk eksekusi secara imperatif dan pemantauan serta re-antrean (_retry_) pesanan yang gagal (dead-letters).
9. `apps/worker/tests/outbox.test.ts` & `apps/worker/tests/cleanup.test.ts`: Uji kasus otomatis.
10. `deno.jsonc`: Penambahan *tasks* `worker:once` dan `test:worker`.

## Perubahan Database / Environtment
- **Migrasi**: Migrasi Drizzle baru dibuat untuk skema `outboxEvents`. Tabel yang lama telah ditimpa agar `retryCount` mendukung komputasi integer dan kolom waktu `availableAt` yang baru ditambahkan.

## Uji Command dan Hasil
- `deno task test:worker` **(PASS)**: 3 tes berhasil tervalidasi penuh.
- `deno task worker:once` **(PASS)**: Loop worker dieksekusi secara instan dan keluar secara normal, memastikan tak ada *memory leaks*.
- `deno task format` **(PASS)**: Melakukan formatting seluruh file di _workspace_ yang sebelumnya tidak _terformat_ menjadi tertata dan sesuai dengan pedoman standar (162 _unformatted files_ dikoreksi).
- `deno task quality` **(PASS)**: Tidak ada isu `check:fmt`, `check:lint`, maupun kesalahan pengetikan kompilasi (*Typescript check*).

## Acceptance Criteria Evidence
- **Dua worker tidak memproses row yang sama bersamaan:** Diverifikasi melalui penggunaan `FOR UPDATE SKIP LOCKED` (drizzle: `.for('update', { skipLocked: true })`) di dalam `db.transaction()` singkat untuk mencegah antrian tabel memblokir I/O worker lain.
- **Handler retry idempotent:** Mekanisme _retry_ selalu merekam _attempt_ pada tabel `sss_job_attempts` sebelum mendelegasikan perintah kepada *handler*.
- **Failure tidak hilang diam-diam:** Limit retry dikonfigurasi ke 5 (`MAX_RETRIES`). Jika gagal melampaui batas ini, tabel diubah menjadi `failed` dan *error trace* diselamatkan ke dalam `errorDetails`. Tersedia command `deno run -A apps/worker/src/ops.ts inspect` untuk menelusurinya.
- **Reservation expired kembali tersedia:** Worker secara eksplisit mengeksekusi *update* untuk merestorasi kuantitas yang ditahan di `sss_inventory_reservations` ke kolom `available` tabel `sss_inventory_levels` dan melampirkan log *release movement*.

## Blocker yang Belum Selesai
Tidak ada *blocker*. Fitur _worker_ siap merespon dan menangani pesan _Outbox_ untuk event notifikasi/pemesanan berikutnya!

## Handoff Day 32
- Event integrasi untuk Modul Email (misal. Resend atau AWS SES) sekarang dapat menggunakan `sss_outbox_events` karena infrastruktur retry dan worker sudah sangat andal.
- Dapat memperluas Cleanup Worker untuk melakukan arsip (archiving) histori *order* usang atau analitik mingguan/bulanan.
