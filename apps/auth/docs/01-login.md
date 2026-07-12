# Login Username dan Password

## URL

`auth.starsuperscare.net/login`

Legacy route `starsuperscare.net/auth/login/user` melakukan redirect ke URL canonical.

## Form

- Username.
- Password.
- Remember me.
- Link forgot password.
- Link signup.

## Alur API

1. Normalize username secara konsisten.
2. Cari credential dengan lookup yang aman.
3. Verifikasi password hash.
4. Periksa status akun.
5. Buat session random opaque.
6. Simpan hash session token, device metadata, expiry.
7. Set secure cookie.
8. Catat login audit.
9. Redirect ke validated `return_to` atau dashboard home.

## Proteksi

- Rate limit per IP dan username hash.
- Delay/risk response tanpa account enumeration.
- Regenerate session setelah login.
- Lock sementara atau challenge setelah kegagalan berulang.
- CSRF untuk request state-changing.

## Toast

- Success: `Login berhasil`.
- Error umum: `Username atau password tidak valid`.
- Locked: `Akun sementara dikunci. Gunakan pemulihan akun.`
