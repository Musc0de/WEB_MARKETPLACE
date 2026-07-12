# Roadmap Implementasi

## Fase 0 — Persiapan

1. Buat repository dan Deno workspace.
2. Siapkan domain development, staging, dan production.
3. Buat project Neon dan branch `development`, `staging`, `production`.
4. Tetapkan payment, email, shipping, dan object-storage provider melalui interface.
5. Pasang CI untuk format, lint, type-check, test, dan build.

## Fase 1 — Fondasi database dan API

1. Buat schema identity, catalog, inventory, cart, order, payment, invoice, dan outbox.
2. Buat migration awal dan seed admin.
3. Buat API conventions, error format, request ID, logging, CORS, CSRF, dan rate limit.
4. Tambahkan health endpoint dan database readiness check.

## Fase 2 — Auth

1. Signup username/email/password.
2. Verifikasi email.
3. Login username/password.
4. Session cookie lintas subdomain.
5. Logout, logout semua device, forgot/reset password.
6. Audit login dan rate limiting.

## Fase 3 — Catalog

1. Admin CRUD produk, varian, harga, gambar, kategori, dan stok.
2. Storefront product list, filter, search, product detail, dan card.
3. Hitung rating, review count, stock, dan net sold.
4. Tambahkan flow produk digital dan fisik.

## Fase 4 — Cart dan checkout

1. Guest cart token.
2. User cart di database.
3. Merge guest cart setelah login.
4. Address, shipping, voucher, payment selection, review.
5. Snapshot harga dan produk sebelum payment.

## Fase 5 — Payment, order, dan akun otomatis

1. Buat payment intent/transaction.
2. Verifikasi webhook dan idempotency.
3. Tandai order paid di transaction.
4. Kurangi/reserve stok dengan benar.
5. Buat atau tautkan akun client.
6. Buat invoice dan enqueue email.

## Fase 6 — Dashboard

Implementasikan home, profile, orders, tracking, history, invoice, downloads, address, wishlist,
notifications, return/refund, review, support, dan settings.

## Fase 7 — Worker dan realtime

1. Outbox publisher/processor.
2. Email retry dan dead-letter state.
3. SSE notification stream.
4. Invoice PDF generation.
5. Cleanup token/session/cart.

## Fase 8 — Hardening dan launch

1. Unit, integration, E2E, load, dan security testing.
2. Accessibility dan responsive check.
3. Backup/restore drill.
4. Staging UAT.
5. Production rollout bertahap dan monitoring.
