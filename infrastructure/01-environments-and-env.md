# Environments dan Environment Variables

## Environment

```text
local
 test
staging
production
```

## Variable minimum

```text
APP_ENV
PUBLIC_ROOT_URL
PUBLIC_SHOP_URL
PUBLIC_AUTH_URL
PUBLIC_DASHBOARD_URL
PUBLIC_API_URL
DATABASE_URL
DATABASE_URL_DIRECT
SESSION_COOKIE_SECRET
CSRF_SECRET
PAYMENT_PROVIDER_*
EMAIL_PROVIDER_*
OBJECT_STORAGE_*
LOG_LEVEL
```

## Rules

- `.env.example` hanya berisi nama dan contoh non-secret.
- Production secrets dikelola platform secret store.
- Secret rotation mempunyai runbook.
- Preview environment memakai database branch dan credential sendiri.
- Browser hanya menerima variable berprefix public yang sudah ditinjau.
