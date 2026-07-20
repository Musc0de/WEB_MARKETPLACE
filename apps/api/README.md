# API App — Deno + Hono

**Domain:** `api.starsuperscare.net/v1`

## Struktur module

```text
modules/auth
modules/catalog
modules/cart
modules/checkout
modules/orders
modules/payments
modules/invoices
modules/notifications
modules/returns
modules/reviews
modules/support
modules/admin
```

## Middleware urutan umum

1. Request ID.
2. Structured logging.
3. Security headers.
4. CORS.
5. Rate limit.
6. Session/authentication.
7. CSRF untuk mutasi cookie-based.
8. Validation.
9. Route handler.
10. Error mapper.

## Response

```json
{
  "data": {},
  "meta": { "request_id": "..." },
  "error": null
}
```

Error tidak mengirim stack trace ke client.
