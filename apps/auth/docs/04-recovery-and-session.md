# Recovery, Session, dan SSO Subdomain

## Forgot/reset password

1. User memasukkan username atau email recovery.
2. Respons selalu generik.
3. Buat token random, simpan hash dan expiry.
4. Kirim link reset ke email terverifikasi.
5. Setelah reset, revoke session lama sesuai kebijakan.
6. Catat security audit dan kirim notifikasi perubahan password.

## Session model

- Token session opaque dan random.
- Database menyimpan hash token, bukan raw token.
- Cookie contoh: `__Secure-ssc_session`.
- Attribute: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`.
- Untuk SSO sederhana antar-subdomain gunakan domain cookie `.starsuperscare.net` dan lindungi
  seluruh subdomain.
- Opsi lebih kuat untuk fase lanjut: central authorization-code exchange dan host-only cookie per
  aplikasi.

## Session lifecycle

- Rotate saat login, password change, privilege change.
- Idle timeout dan absolute timeout.
- UI menampilkan device/session list.
- `Logout semua perangkat` mencabut seluruh session kecuali opsi current session.

## CSRF dan CORS

- Mutasi berbasis cookie memerlukan CSRF token.
- CORS allowlist hanya origin resmi.
- Credentials tidak boleh digabung dengan wildcard origin.
