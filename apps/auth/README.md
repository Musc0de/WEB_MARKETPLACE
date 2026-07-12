# Auth App

**Domain:** `auth.starsuperscare.net`

## Route

```text
/login
/signup
/activate
/verify-email
/forgot-password
/reset-password
/logout
```

## Identitas login

Client login menggunakan `username + password`. Email tetap wajib untuk invoice, aktivasi, recovery, dan notifikasi.

## Status akun

```text
pending_activation
active
locked
suspended
deleted
```

## Prinsip

- Password di-hash, tidak dienkripsi dan tidak pernah ditampilkan/dikirim.
- Token activation/reset disimpan sebagai hash.
- Pesan login gagal tidak membedakan username ada atau tidak.
- Session dirotasi setelah login dan perubahan security.
- Semua redirect kembali divalidasi terhadap allowlist domain.
