# Shared Configuration

## Configuration groups

- Public URL dan allowed origins.
- Database connection.
- Session/cookie.
- Payment provider.
- Email provider.
- Shipping provider.
- Object storage.
- Observability.
- Feature flags.

## Rules

- Parse environment saat startup dan fail fast bila wajib hilang.
- Pisahkan public config dan server secrets.
- Jangan mengakses `Deno.env` tersebar di business module; gunakan typed config object.
- Redact secret dari log dan error.
- Environment mempunyai identifier eksplisit: development, test, staging, production.
