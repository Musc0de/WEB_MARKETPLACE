# Signup

## URL

`auth.starsuperscare.net/signup`

## Field

- Username unik.
- Nama lengkap.
- Email.
- Password dan konfirmasi.
- Persetujuan syarat dan kebijakan privasi.

## Aturan username

- Case-insensitive untuk uniqueness.
- Simpan `username_display` dan `username_normalized`.
- Karakter terbatas, panjang wajar, reserved words ditolak.
- Username dapat diubah dengan kebijakan dan audit.

## Alur

1. Validate input dengan shared contract.
2. Check username dan email normalized.
3. Hash password dengan password hashing yang kuat.
4. Create user `pending_activation`.
5. Create hashed email-verification token.
6. Enqueue verification email melalui outbox.
7. Setelah verify, ubah status ke `active`.
8. Buat session dan merge guest cart bila ada.

## Duplicate email

Jangan mengungkap detail berlebihan. Bila email sudah ada, tawarkan login/recovery secara aman.

## Acceptance criteria

- Password tidak masuk log/analytics.
- Token sekali pakai dan mempunyai expiry.
- Signup berulang tidak mengirim email tanpa rate limit.
