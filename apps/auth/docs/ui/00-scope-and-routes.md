# Auth UI Scope and Routes

```text
/login
/signup
/verify-email
/activate
/forgot-password
/reset-password
/logout
```

Login menggunakan username + password. Email digunakan untuk verifikasi, activation, recovery,
invoice, dan notification.

## Core rules

- Password tidak pernah ditampilkan atau dikirim melalui email.
- Activation token dan reset token sekali pakai.
- `return_to` hanya menerima origin/path yang diizinkan.
- Credential error tidak membocorkan keberadaan username/email.
- Auth UI minimal dan fokus pada completion.
