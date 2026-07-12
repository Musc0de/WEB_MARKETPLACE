# Domain dan Route Canonical

## Domain publik

| Domain | Fungsi |
|---|---|
| `starsuperscare.net` | Landing, tentang, kontak, kebijakan |
| `shop.starsuperscare.net` | Produk, cart, checkout |
| `auth.starsuperscare.net` | Login, signup, aktivasi, recovery |
| `dashboard.starsuperscare.net` | Area client |
| `admin.starsuperscare.net` | Area admin |
| `api.starsuperscare.net` | API v1 dan SSE |
| `assets.starsuperscare.net` | Asset dan file publik |
| `tracking.starsuperscare.net` | Tracking publik berbasis token |

## Route canonical

```text
shop.starsuperscare.net/products
shop.starsuperscare.net/products/{slug}
shop.starsuperscare.net/cart
shop.starsuperscare.net/checkout

auth.starsuperscare.net/login
auth.starsuperscare.net/signup
auth.starsuperscare.net/activate
auth.starsuperscare.net/forgot-password
auth.starsuperscare.net/reset-password

dashboard.starsuperscare.net/home
dashboard.starsuperscare.net/profile
dashboard.starsuperscare.net/orders
dashboard.starsuperscare.net/history
dashboard.starsuperscare.net/invoices
dashboard.starsuperscare.net/downloads
dashboard.starsuperscare.net/addresses
dashboard.starsuperscare.net/payment-methods
dashboard.starsuperscare.net/notifications
dashboard.starsuperscare.net/returns
dashboard.starsuperscare.net/refunds
dashboard.starsuperscare.net/reviews
dashboard.starsuperscare.net/support
dashboard.starsuperscare.net/settings
```

## Redirect kompatibilitas

```text
starsuperscare.net/products/*              -> 301 shop.starsuperscare.net/products/*
starsuperscare.net/auth/login/user         -> 302 auth.starsuperscare.net/login
starsuperscare.net/auth/signup/user        -> 302 auth.starsuperscare.net/signup
dashboard.starsuperscare.net/cart          -> 302 shop.starsuperscare.net/cart
dashboard.starsuperscare.net/checkout/*    -> 302 shop.starsuperscare.net/checkout/*
```

Gunakan satu URL canonical agar SEO, analytics, session, dan navigasi tidak terpecah.

## Redirect setelah login

- Default: `dashboard.starsuperscare.net/home`.
- Dari cart/checkout: kembali ke URL `return_to` yang sudah divalidasi.
- Tolak `return_to` ke origin di luar allowlist untuk mencegah open redirect.
