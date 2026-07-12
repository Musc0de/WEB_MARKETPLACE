# Akun Otomatis Setelah Pembelian Sukses

## Tujuan

Guest yang berhasil membayar otomatis memiliki akun client untuk melihat order dan invoice tanpa
mengirim password plaintext.

## Data checkout minimum

- Full name.
- Email valid.
- Optional desired username.
- Persetujuan komunikasi transaksional.

## Alur setelah webhook payment sukses

1. Verifikasi signature dan provider event ID.
2. Mulai database transaction.
3. Lock payment/order; abaikan event bila sudah diproses.
4. Ubah payment menjadi `paid` dan order menjadi `processing`.
5. Cari user berdasarkan email normalized.
6. Bila user ada, tautkan order ke user.
7. Bila tidak ada, buat user `pending_activation`.
8. Generate username unik bila guest tidak memilih username.
9. Buat activation token random; simpan hash + expiry.
10. Buat invoice record dan outbox events.
11. Commit transaction.
12. Worker mengirim invoice dan email aktivasi.

## Aktivasi

Email berisi link satu kali ke:

`auth.starsuperscare.net/activate?token=...`

Client kemudian:

1. Memastikan email/order context.
2. Memilih atau mengonfirmasi username.
3. Membuat password.
4. Akun berubah menjadi `active`.
5. Session dibuat dan client diarahkan ke order detail.

## Aturan keamanan

- Jangan pernah membuat password sementara lalu mengirimkannya lewat email.
- Token disimpan sebagai hash dan hanya dapat digunakan sekali.
- Username hasil generate harus dapat diganti saat aktivasi.
- Payment webhook harus idempotent.
- Bila email sudah terdaftar, jangan membuat akun duplikat.
