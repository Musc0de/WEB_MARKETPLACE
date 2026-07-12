# Roadmap 50 Hari — Ringkasan

Setiap hari terdiri dari empat blok dua jam. Detail dan prompt tersedia pada file harian.

## Minggu 1 — Foundation: arsitektur, workspace, app scaffold, CI

- **Hari 01: Audit repository dan kunci arsitektur** — ADR-001 architecture freeze; Baseline repository audit.
- **Hari 02: Buat root Deno workspace dan tooling dasar** — Root Deno workspace valid; Task runner konsisten.
- **Hari 03: Scaffold lima aplikasi React + Vite** — Lima frontend dapat berjalan; Routing shell.
- **Hari 04: Scaffold Hono API dan worker internal** — Hono API baseline; Worker baseline.
- **Hari 05: Shared packages, CI, dan quality gate** — Shared package skeletons; Typed environment config.

## Minggu 2 — Neon dan schema database

- **Hari 06: Hubungkan Neon, Drizzle, dan migration tooling** — Neon runtime client; Drizzle migration config.
- **Hari 07: Implement identity, role, profile, address, dan session schema** — Identity schema; Session/token schema.
- **Hari 08: Implement catalog, pricing, inventory, dan review schema** — Catalog schema; Price schema.
- **Hari 09: Implement cart, order, payment, invoice, shipment, dan digital schema** — Cart schema; Order snapshot schema.
- **Hari 10: Implement purnajual, notifikasi, outbox, audit, seed, dan DB gate** — Purnajual/support schema; Notification/outbox schema.

## Minggu 3 — API baseline dan autentikasi

- **Hari 11: Lengkapi API conventions, validation, CORS, CSRF, rate limit, dan RBAC context** — API conventions; Validation/error middleware.
- **Hari 12: Signup, password hashing, dan verifikasi email** — Secure password module; Signup API.
- **Hari 13: Login username/password, session, logout, dan audit** — Login API; Session lifecycle.
- **Hari 14: Forgot/reset password, activation, dan return_to allowlist** — Password recovery API; Account activation API.
- **Hari 15: Bangun aplikasi auth dan selesaikan Auth Gate** — Auth frontend complete; API integration.

## Minggu 4 — Catalog dan admin catalog/inventory

- **Hari 16: Public catalog API: list, detail, category, brand, search** — Public product list/detail APIs; Filter/sort/search.
- **Hari 17: Admin RBAC dan CRUD catalog API** — RBAC permissions; Admin catalog CRUD API.
- **Hari 18: Admin catalog UI dan upload assets** — Admin product UI; Variant/price forms.
- **Hari 19: Inventory service, reservations primitive, dan admin stock UI** — Inventory domain service; Reservation primitives.
- **Hari 20: Sold/rating statistics, review read model, dan Catalog Gate** — Sales/rating projection; Review read API.

## Minggu 5 — Storefront products, search, wishlist

- **Hari 21: Storefront shell, design system, API client, dan goey-toast wrapper** — Shared UI foundation; Goey-toast wrapper.
- **Hari 22: Product list dan product card final** — Products page; Final ProductCard.
- **Hari 23: Product detail, variants, gallery, reviews, dan related products** — Product detail page; Variant-aware CTA.
- **Hari 24: Search, category, brand, filters, sort, dan URL state** — Search page; Category/brand listing.
- **Hari 25: Wishlist guest/account dan Storefront Gate** — Guest wishlist; Account wishlist API.

## Minggu 6 — Cart, checkout, order, payment

- **Hari 26: Cart API untuk guest dan account** — Guest cart identity; Cart CRUD API.
- **Hari 27: Cart merge, revalidation, voucher, dan save-for-later** — Idempotent cart merge; Real-time revalidation.
- **Hari 28: Cart UI lengkap** — Cart page; CRUD interactions.
- **Hari 29: Checkout address/shipping/review, order snapshot, dan stock reservation** — Checkout validation; Shipping adapter.
- **Hari 30: Payment adapter, verified webhook, dan Checkout Gate** — Payment provider abstraction; Payment flow UI/API.

## Minggu 7 — Worker, invoice, email, akun otomatis, notifications

- **Hari 31: Transactional outbox worker, locking, retry, dan cleanup jobs** — Outbox worker; Retry/dead-letter semantics.
- **Hari 32: Invoice PDF, object storage, dan transactional email** — Invoice generator; Private invoice storage.
- **Hari 33: Akun otomatis setelah guest payment dan claim order aman** — Auto-account worker handler; Secure order claim.
- **Hari 34: Persistent notifications, read/unread API, dan SSE** — Notification worker handlers; Read/unread REST API.
- **Hari 35: Commerce E2E, failure recovery, dan Integration Gate** — Full commerce integration suite; Failure/retry matrix.

## Minggu 8 — Dashboard client

- **Hari 36: Dashboard shell, route guards, navigation, dan home summary** — Protected dashboard shell; Desktop/mobile navigation.
- **Hari 37: Profile, security, sessions, addresses, dan payment method metadata** — Profile UI/API; Security/session management.
- **Hari 38: Orders list, detail, tracking, buy-again, dan invoice link** — Orders list/detail; Tracking timeline.
- **Hari 39: History, invoices, dan digital downloads** — History API/UI; Invoice center.
- **Hari 40: Notifications, wishlist, reviews, settings, dan Dashboard Gate** — Notification center + SSE; Wishlist dashboard.

## Minggu 9 — Returns, support, admin operations, tracking

- **Hari 41: Returns dan refunds end-to-end** — Return API/dashboard; Admin return workflow.
- **Hari 42: Support FAQ, tickets, messages, dan attachments** — FAQ/ticket API; Dashboard support center.
- **Hari 43: Admin orders, payments, invoices, dan customers** — Admin order operations; Payment/invoice views.
- **Hari 44: Admin review moderation, inventory operations, audit, dan operational dashboard** — Review moderation; Inventory operations.
- **Hari 45: Public tracking, shipment events, dan Operations Gate** — Public tracking token/API; Shipment event adapter.

## Minggu 10 — Testing, security, staging, production

- **Hari 46: Lengkapi unit/integration test, factories, dan coverage gate** — Critical unit coverage; Integration coverage.
- **Hari 47: E2E browser, accessibility, responsive, dan failure journeys** — Core E2E suite; Failure journey tests.
- **Hari 48: Security, observability, backup/restore, dan operational runbooks** — Threat model/remediation; Observability and alerts.
- **Hari 49: Deploy staging, migration rehearsal, DNS/CORS/cookie validation, dan UAT** — Staging deployments; Migration rehearsal.
- **Hari 50: Production release, smoke test, rollback readiness, dan handover** — Production release; Smoke evidence.

