# Shared Auth Package

## Tanggung jawab

- Normalize username/email.
- Password hash/verify.
- Generate dan hash token.
- Session create/rotate/revoke.
- Cookie builder.
- CSRF token validation.
- Role/permission helpers.
- Security audit helpers.

## Password

Gunakan Argon2id bila tersedia dan kompatibel dengan target deployment; simpan full encoded hash yang memuat salt/parameter. Jangan memakai SHA-256 langsung untuk password.

## Token

- Generate dengan cryptographically secure random.
- Simpan hash token.
- Raw token hanya dikirim pada browser/email sekali.
- Gunakan timing-safe comparison.

## Permission

Role awal:

```text
client
support_agent
inventory_manager
order_manager
admin
super_admin
```

Authorization tetap berbasis aksi/resource, bukan hanya menyembunyikan menu UI.
