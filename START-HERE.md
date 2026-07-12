# Mulai dari Sini — 12 Langkah Ringkas

Dokumen ini adalah urutan kerja paling singkat. Detail setiap langkah tersedia pada folder terkait.

## 1. Tetapkan domain

Gunakan `shop` untuk belanja, `auth` untuk login/signup, `dashboard` untuk akun client, `api` untuk
backend, dan `admin` untuk operasional. Terapkan redirect route lama.

## 2. Buat Deno monorepo

Buat `apps/*` dan `packages/*`, lalu daftarkan semuanya pada root `deno.jsonc` workspace.

## 3. Buat Neon environments

Siapkan branch `development`, `staging`, dan `production`. Gunakan pooled URL untuk runtime dan
direct URL untuk migration.

## 4. Buat schema dasar

Kerjakan identity/session, products/variants/inventory, cart, orders/payments/invoices,
notification/outbox, return/refund, dan support.

## 5. Bangun auth

Implementasikan signup, verifikasi email, login username/password, logout, recovery, session lintas
subdomain, CSRF, dan rate limit.

## 6. Bangun catalog

Implementasikan product list/detail, category/search, product card, rating, stok, dan `net_sold`
dari order berbayar dikurangi refund.

## 7. Bangun cart

Guest cart menggunakan token opaque; user cart tersimpan di database. Merge keduanya setelah login
dengan validasi stok dan harga.

## 8. Bangun checkout

Pisahkan address, shipping, payment, review, dan result. Semua total dihitung server dan submit
memakai idempotency key.

## 9. Integrasikan payment dan akun otomatis

Webhook payment yang terverifikasi menandai order paid, membuat/menautkan akun, membuat invoice,
serta enqueue email. Password tidak dikirim; client membuatnya melalui activation link.

## 10. Bangun dashboard

Kerjakan home, profile, orders, tracking, history, invoices, digital downloads, addresses, wishlist,
notifications, return/refund, reviews, support, dan settings.

## 11. Bangun worker

Proses transactional outbox, invoice PDF, email, notification, SSE signal, retry, cleanup
token/session, dan release stock reservation.

## 12. Uji dan launch

Jalankan unit, integration, E2E, accessibility, security, backup/restore, staging UAT, lalu
production rollout dengan monitoring.

## File pertama yang dibaca

1. `README.md`
2. `DIRECTORY-TREE.md`
3. `docs/00-overview/04-implementation-roadmap.md`
4. `packages/database/docs/01-neon-setup.md`
5. `quality/03-launch-checklist.md`
