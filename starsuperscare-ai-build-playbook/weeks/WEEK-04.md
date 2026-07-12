# Minggu 4 — Catalog dan admin catalog/inventory

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

## Hari 16 — Public catalog API: list, detail, category, brand, search

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/05-api/ENDPOINTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement repository/service query untuk active products, variant summary, effective price, available stock, rating, review count, dan net_sold.
- **10:15–12:15:** Implement GET /products dengan page/per_page, search, category, brand, price range, stock, badges, dan sort allowlist.
- **13:15–15:15:** Implement GET /products/{slug}, categories, brands, reviews; gunakan typed contracts dan stable response envelope.
- **15:30–17:30:** Tulis query/integration tests, EXPLAIN critical queries bila tersedia, perbaiki index/N+1, dan seed data yang cukup untuk pagination.

**Deliverables:**

- Public product list/detail APIs
- Filter/sort/search
- Category/brand endpoints
- Catalog API tests

**Acceptance criteria:**

- [ ] Produk draft/inactive tidak bocor
- [ ] Harga/rating/sold/stok konsisten
- [ ] Pagination deterministic
- [ ] Query tidak N+1 pada card list

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/catalog`
- `apps/api/src/routes/v1/products.ts`
- `packages/contracts/src/catalog.ts`

**Command verifikasi minimum:**

```bash
deno task test:catalog
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-16.md`

---

## Hari 17 — Admin RBAC dan CRUD catalog API

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `apps/admin/README.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/08-security/SECURITY-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Definisikan permissions granular catalog.read/write/publish, inventory.adjust, order.manage, refund.manage, support.manage, dan admin role seed.
- **10:15–12:15:** Implement admin endpoints category, brand, product, variant, price, publish/unpublish/archive dengan Zod dan optimistic concurrency.
- **13:15–15:15:** Implement audit trail before/after yang aman, soft-delete policy, slug/SKU conflict handling, dan transaction boundaries.
- **15:30–17:30:** Tulis authorization matrix tests: unauthenticated, customer, staff terbatas, admin; pastikan default-deny.

**Deliverables:**

- RBAC permissions
- Admin catalog CRUD API
- Audit trail
- Authorization tests

**Acceptance criteria:**

- [ ] Customer tidak dapat mengakses /v1/admin/*
- [ ] Publish membutuhkan data minimum valid
- [ ] Perubahan tercatat audit
- [ ] Concurrent edit terdeteksi

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/admin/catalog`
- `apps/api/src/routes/v1/admin/catalog.ts`
- `packages/contracts/src/admin-catalog.ts`

**Command verifikasi minimum:**

```bash
deno task test:admin-api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-17.md`

---

## Hari 18 — Admin catalog UI dan upload assets

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `apps/admin/README.md`
- `docs/03-storefront/PRODUCTS.md`
- `docs/08-security/SECURITY-CHECKLIST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun admin shell, auth guard, permission-aware navigation, product list, filters, empty/loading/error states.
- **10:15–12:15:** Bangun create/edit product, category, brand, variant, price, digital/physical fields, validation, dan unsaved-change guard.
- **13:15–15:15:** Implement object storage adapter/presigned upload flow untuk product image; validate MIME/size/ownership dan simpan metadata saja di Neon.
- **15:30–17:30:** Integrasikan goey-toast, optimistic UI yang aman, upload progress, build/test, dan dokumentasikan provider storage env.

**Deliverables:**

- Admin product UI
- Variant/price forms
- Asset upload adapter
- Admin UI tests

**Acceptance criteria:**

- [ ] Frontend tidak menerima storage secret
- [ ] Upload tervalidasi server
- [ ] Admin action mengikuti permission
- [ ] Form physical/digital conditional benar

**File/folder utama yang diperkirakan berubah:**

- `apps/admin/src/features/catalog`
- `apps/api/src/modules/assets`
- `packages/contracts/src/assets.ts`

**Command verifikasi minimum:**

```bash
deno task build:admin
deno task test:admin
deno task quality
```

**External gate:**

- Object storage S3-compatible diperlukan untuk upload nyata. Bila belum ada, gunakan in-memory/local development adapter dan jangan memalsukan URL production.

**Prompt siap-tempel:** `../prompts/DAY-18.md`

---

## Hari 19 — Inventory service, reservations primitive, dan admin stock UI

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `docs/03-storefront/CHECKOUT.md`
- `docs/06-database/SCHEMA.md`
- `apps/admin/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement inventory query dan movement service dengan transaction/locking, reason codes, actor, source reference, serta invariant available/reserved/sold.
- **10:15–12:15:** Implement stock adjustment, transfer-ready abstraction, low-stock query, and reservation primitive create/commit/release/expire.
- **13:15–15:15:** Bangun admin inventory list/detail/adjustment history dan form adjustment dengan permission plus confirmation.
- **15:30–17:30:** Tulis concurrency/invariant tests dan audit reconciliation report untuk sample data.

**Deliverables:**

- Inventory domain service
- Reservation primitives
- Admin inventory UI
- Concurrency tests

**Acceptance criteria:**

- [ ] Stok tidak dapat negatif
- [ ] Setiap perubahan memiliki ledger
- [ ] Reservation idempotent
- [ ] Adjustment manual diaudit

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/inventory`
- `apps/admin/src/features/inventory`
- `packages/contracts/src/inventory.ts`

**Command verifikasi minimum:**

```bash
deno task test:inventory
deno task build:admin
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-19.md`

---

## Hari 20 — Sold/rating statistics, review read model, dan Catalog Gate

**Phase:** Catalog dan Admin

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement pure functions dan database operations untuk gross_sold, refunded_sold, net_sold, average rating, review count, dan Indonesian sold label.
- **10:15–12:15:** Implement review public read API dengan moderation/verified flags dan aggregate recalculation/reconciliation command.
- **13:15–15:15:** Tambahkan sample paid/refunded/reviewed orders untuk test, lalu verifikasi card projection dan product detail response.
- **15:30–17:30:** Jalankan catalog/admin test suite, query review, quality gate, dan tulis Catalog Gate report.

**Deliverables:**

- Sales/rating projection
- Review read API
- Reconciliation command
- Catalog gate report

**Acceptance criteria:**

- [ ] Cart tidak mengubah sold
- [ ] Refund finalized mengoreksi net_sold
- [ ] Label 1,2 rb benar untuk locale Indonesia
- [ ] Aggregate dapat direbuild dari source events

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/catalog/stats.ts`
- `apps/api/src/modules/reviews/read.ts`
- `scripts/reconcile-product-stats.ts`

**Command verifikasi minimum:**

```bash
deno task test:catalog
deno task stats:reconcile:dry
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-20.md`

---
