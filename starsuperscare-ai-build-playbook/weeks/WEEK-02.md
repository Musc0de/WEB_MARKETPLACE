# Minggu 2 — Neon dan schema database

## Arsitektur yang tidak boleh diubah

- `starsuperscare.net`: landing dan halaman informasi publik.
- `shop.starsuperscare.net`: products, product detail, category/search, cart, checkout, dan guest wishlist.
- `auth.starsuperscare.net`: login, signup, verifikasi, aktivasi, forgot/reset, dan logout.
- `dashboard.starsuperscare.net`: area client setelah login.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: operasi admin.
- `tracking.starsuperscare.net`: tracking publik dengan token opaque.
- `assets.starsuperscare.net`: target aset publik/CDN bila dipakai.
- `apps/worker`: proses internal; tidak mempunyai subdomain publik.

Cart dan checkout tidak dipindahkan ke dashboard. Database hanya boleh diakses oleh `apps/api` dan `apps/worker` melalui `packages/database`.

## Hari 06 — Hubungkan Neon, Drizzle, dan migration tooling

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/06-database/NEON-CONNECTION.md`
- `packages/database/README.md`
- `database/migrations/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Siapkan konfigurasi Neon development/staging/production dan dokumentasikan pooled runtime URL versus direct migration URL.
- **10:15–12:15:** Implement packages/database client untuk API/worker, Drizzle config untuk migration, serta pencegahan import database dari frontend.
- **13:15–15:15:** Buat connection smoke test, transaction helper, UTC timestamp convention, dan integer-IDR helper boundaries.
- **15:30–17:30:** Jalankan koneksi development, buat migration kosong pertama, cek secret hygiene, dan tulis panduan branch database.

**Deliverables:**

- Neon runtime client
- Drizzle migration config
- DB smoke test
- Environment matrix

**Acceptance criteria:**

- [ ] Runtime memakai pooled URL
- [ ] Migration memakai direct URL
- [ ] SSL diwajibkan
- [ ] DATABASE_URL hanya tersedia pada API/worker/migration

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/client.ts`
- `packages/database/drizzle.config.ts`
- `packages/database/src/transaction.ts`
- `scripts/db-smoke.ts`

**Command verifikasi minimum:**

```bash
deno task db:check
deno task db:generate
deno task quality
```

**External gate:**

- Neon project dan connection strings development diperlukan untuk koneksi nyata. Bila belum ada, selesaikan adapter dan gunakan test yang di-skip dengan alasan eksplisit.

**Prompt siap-tempel:** `../prompts/DAY-06.md`

---

## Hari 07 — Implement identity, role, profile, address, dan session schema

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/06-database/SCHEMA.md`
- `docs/02-auth/LOGIN-SIGNUP-FLOWS.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Model users, profiles, password credentials, roles, permissions, mappings, dan status lifecycle dengan constraint yang jelas.
- **10:15–12:15:** Model sessions, login attempts, verification/reset/activation tokens; simpan token digest, expiry, used/revoked timestamps.
- **13:15–15:15:** Model addresses dengan type shipping/billing, primary flags, ownership, dan normalisasi field Indonesia tanpa mengunci provider wilayah.
- **15:30–17:30:** Buat migration, schema tests untuk unique/index/FK, factory data, dan review keamanan field sensitif.

**Deliverables:**

- Identity schema
- Session/token schema
- RBAC schema
- Address schema dan tests

**Acceptance criteria:**

- [ ] Username dan normalized email unik
- [ ] Password plaintext tidak memiliki kolom
- [ ] Token hanya disimpan sebagai hash/digest
- [ ] Session dapat direvoke per perangkat

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/identity.ts`
- `packages/database/src/schema/rbac.ts`
- `packages/database/src/schema/addresses.ts`
- `migrations/*`

**Command verifikasi minimum:**

```bash
deno task db:generate
deno task db:migrate
deno task test:db
```

**Prompt siap-tempel:** `../prompts/DAY-07.md`

---

## Hari 08 — Implement catalog, pricing, inventory, dan review schema

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/06-database/SCHEMA.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Model brands, categories bertingkat, products, product-category mapping, product variants, status, type physical/digital, dan SEO fields.
- **10:15–12:15:** Model images/assets metadata dan pricing history dengan integer rupiah, compare-at price, effective range, serta constraint non-negatif.
- **13:15–15:15:** Model warehouses, inventory levels, reservations, movements ledger, purchase limit, dan concurrency/version field.
- **15:30–17:30:** Model rating/review statistics dan product_sales_stats gross/refunded/net; buat migration, index, tests, dan seed sample.

**Deliverables:**

- Catalog schema
- Price schema
- Inventory ledger/reservation schema
- Sold/rating stats schema

**Acceptance criteria:**

- [ ] Slug dan SKU unik
- [ ] Harga/stok tidak negatif
- [ ] net_sold dapat direkonsiliasi
- [ ] Produk digital tidak diwajibkan memiliki berat/shipping

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/catalog.ts`
- `packages/database/src/schema/inventory.ts`
- `packages/database/src/schema/reviews.ts`
- `migrations/*`

**Command verifikasi minimum:**

```bash
deno task db:generate
deno task db:migrate
deno task test:db
```

**Prompt siap-tempel:** `../prompts/DAY-08.md`

---

## Hari 09 — Implement cart, order, payment, invoice, shipment, dan digital schema

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/03-storefront/CHECKOUT.md`
- `docs/06-database/SCHEMA.md`
- `docs/06-database/SCHEMA.md`

**Jadwal per jam:**

- **08:00–10:00:** Model carts/cart_items untuk guest token hash atau user, active-cart uniqueness, selected/save-for-later state, dan price observation.
- **10:15–12:15:** Model orders/order_items/order_addresses sebagai immutable snapshot, order number, amount breakdown integer, status transitions, dan idempotency link.
- **13:15–15:15:** Model payments/payment_events, provider IDs, invoices, shipments/events, vouchers/redemptions, serta customer payment method token metadata.
- **15:30–17:30:** Model digital assets dan entitlements/download limits; buat migration, index, FK policy, dan schema tests.

**Deliverables:**

- Cart schema
- Order snapshot schema
- Payment/invoice/shipment schema
- Digital entitlement schema

**Acceptance criteria:**

- [ ] Order item tetap terbaca meski produk berubah
- [ ] Provider event ID unik
- [ ] Tidak ada raw card data
- [ ] Guest cart dan account cart dapat dibedakan aman

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/cart.ts`
- `packages/database/src/schema/orders.ts`
- `packages/database/src/schema/payments.ts`
- `packages/database/src/schema/digital.ts`

**Command verifikasi minimum:**

```bash
deno task db:generate
deno task db:migrate
deno task test:db
```

**Prompt siap-tempel:** `../prompts/DAY-09.md`

---

## Hari 10 — Implement purnajual, notifikasi, outbox, audit, seed, dan DB gate

**Phase:** Neon dan schema

**Baca sebelum mulai:**

- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/06-database/SCHEMA.md`
- `docs/06-database/SCHEMA.md`
- `database/migrations/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Model returns, return_items, refunds, support tickets/messages, attachments metadata, dan verified-purchase reviews.
- **10:15–12:15:** Model notifications dengan read_at, notification deliveries, outbox events, job attempts, audit logs, serta idempotency keys.
- **13:15–15:15:** Buat seed roles/permissions/admin development/category/product/stock; buat data factory dan reset strategy khusus non-production.
- **15:30–17:30:** Jalankan migration dari database kosong, seed, schema assertions, dan DB gate report; perbaiki seluruh masalah constraint/index.

**Deliverables:**

- Purnajual/support schema
- Notification/outbox schema
- Audit/idempotency schema
- Repeatable migrations and seeds

**Acceptance criteria:**

- [ ] Migration fresh database berhasil
- [ ] Seed idempotent atau reset-safe
- [ ] read/unread hanya bersumber dari read_at
- [ ] Outbox siap diproses idempotent

**File/folder utama yang diperkirakan berubah:**

- `packages/database/src/schema/aftercare.ts`
- `packages/database/src/schema/notifications.ts`
- `packages/database/src/schema/audit.ts`
- `database/seeds/*`

**Command verifikasi minimum:**

```bash
deno task db:reset:dev
deno task db:migrate
deno task db:seed
deno task test:db
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-10.md`

---
