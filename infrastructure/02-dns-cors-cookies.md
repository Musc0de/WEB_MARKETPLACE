# DNS, TLS, CORS, dan Cookies

## DNS

Buat record untuk root, shop, auth, dashboard, api, admin, assets, dan tracking. Pakai HTTPS untuk seluruh origin dan redirect HTTP ke HTTPS.

## CORS allowlist

```text
https://shop.starsuperscare.net
https://auth.starsuperscare.net
https://dashboard.starsuperscare.net
https://admin.starsuperscare.net
```

Jangan memakai wildcard origin bersama credentials.

## Cookie

MVP SSO:

```text
Name: __Secure-ssc_session
Secure: true
HttpOnly: true
SameSite: Lax
Domain: .starsuperscare.net
Path: /
```

Karena domain cookie dikirim ke subdomain, semua subdomain harus dikendalikan dan diamankan. Admin dapat memakai session/cookie terpisah agar risiko lebih kecil.

## Headers

Aktifkan HSTS, CSP yang diuji, Referrer-Policy, X-Content-Type-Options, dan frame-ancestors. Sesuaikan CSP untuk payment provider dan asset domain secara minimal.
