# Auth Endpoints

```text
POST /v1/auth/signup
POST /v1/auth/verify-email
POST /v1/auth/login
POST /v1/auth/logout
POST /v1/auth/logout-all
POST /v1/auth/forgot-password
POST /v1/auth/reset-password
POST /v1/auth/activate-purchase-account
GET  /v1/auth/session
GET  /v1/auth/sessions
DELETE /v1/auth/sessions/{session_id}
```

## Login request

```json
{
  "username": "client123",
  "password": "...",
  "remember_me": true
}
```

## Signup request

```json
{
  "username": "client123",
  "full_name": "Client Name",
  "email": "client@example.com",
  "password": "...",
  "terms_accepted": true
}
```

## Rules

- Password tidak pernah dikembalikan API.
- Login error generik.
- Token activation/reset single-use.
- Session cookie ditetapkan server; frontend tidak menyimpan token session di local storage.
