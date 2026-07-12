# Minggu 6 — Cart, checkout, order, payment

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

## Hari 26 — Cart API untuk guest dan account

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/03-storefront/CART.md`
- `docs/05-api/ENDPOINTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement guest cart token issuance dengan random opaque token, server-side digest, expiry/rotation, serta one-active-cart invariant.
- **10:15–12:15:** Implement GET cart dan add/update/remove/clear item transactionally untuk guest atau session user.
- **13:15–15:15:** Hitung line totals/discount/subtotal di server, return item status available/out_of_stock/price_changed/inactive/quantity_adjusted.
- **15:30–17:30:** Tulis authorization, token, validation, concurrent update, purchase limit, and total calculation tests.

**Deliverables:**

- Guest cart identity
- Cart CRUD API
- Server-calculated totals
- Cart API tests

**Acceptance criteria:**

- [ ] Browser tidak menjadi source of truth cart
- [ ] Guest token tidak disimpan plaintext DB
- [ ] Harga client diabaikan
- [ ] User tidak dapat membaca cart lain

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/cart`
- `apps/api/src/routes/v1/cart.ts`
- `packages/contracts/src/cart.ts`

**Command verifikasi minimum:**

```bash
deno task test:cart
deno task test:api
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-26.md`

---

## Hari 27 — Cart merge, revalidation, voucher, dan save-for-later

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement POST /cart/merge transaction: merge variant sama, clamp stock/purchase limit, latest price, merged marker, dan idempotency.
- **10:15–12:15:** Implement revalidation saat cart dibaca/diubah, warning changes, inactive cleanup policy, dan race-safe versioning.
- **13:15–15:15:** Implement save-for-later dan voucher validation/application dasar dengan explicit rule engine serta integer amounts.
- **15:30–17:30:** Tulis merge matrix tests, price/stock changes, duplicate retry, voucher edge cases, dan rollback behavior.

**Deliverables:**

- Idempotent cart merge
- Real-time revalidation
- Voucher foundation
- Save-for-later

**Acceptance criteria:**

- [ ] Merge ulang tidak menduplikasi item
- [ ] Stok tidak terlampaui
- [ ] Perubahan harga transparan
- [ ] Voucher tidak dipercaya dari client

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/cart/merge.ts`
- `apps/api/src/modules/cart/revalidate.ts`
- `apps/api/src/modules/vouchers`

**Command verifikasi minimum:**

```bash
deno task test:cart
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-27.md`

---

## Hari 28 — Cart UI lengkap

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CART.md`
- `docs/03-storefront/CART.md`
- `docs/07-ui/GOOEY-TOAST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /cart loader dan cart summary untuk guest/session dengan states loading/empty/error/expired token.
- **10:15–12:15:** Bangun item table/card responsive, select checkout, increment/decrement, remove, clear, save-for-later, voucher, dan order note.
- **13:15–15:15:** Tampilkan server totals, price/stock warnings, shipping estimate placeholder yang jelas, and checkout eligibility.
- **15:30–17:30:** Tulis UI/integration tests, keyboard/focus, optimistic mutation rollback, goey-toast, and build storefront.

**Deliverables:**

- Cart page
- CRUD interactions
- Warnings and totals
- Cart UI tests

**Acceptance criteria:**

- [ ] Total selalu dari response server
- [ ] Mutation disabled saat pending
- [ ] Warning price/stock terlihat
- [ ] Mobile cart tetap usable

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/cart`
- `apps/storefront/src/pages/CartPage.tsx`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-28.md`

---

## Hari 29 — Checkout address/shipping/review, order snapshot, dan stock reservation

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CHECKOUT.md`
- `docs/03-storefront/CHECKOUT.md`
- `docs/03-storefront/CHECKOUT.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement address validation/persistence and guest address input, shipping option adapter dengan deterministic mock, serta digital-only no-shipping branch.
- **10:15–12:15:** Implement checkout validate/shipping-options endpoints dan server recomputation untuk product, stock, price, voucher, shipping, tax, total.
- **13:15–15:15:** Implement POST /checkout/orders dengan idempotency key, immutable order/address/item snapshot, dan inventory reservation expiry.
- **15:30–17:30:** Bangun address/shipping/review UI state machine, recovery after refresh, tests untuk mixed cart, stale price/stock, duplicate submit, and reservation release schedule.

**Deliverables:**

- Checkout validation
- Shipping adapter
- Idempotent order creation
- Inventory reservation and checkout UI

**Acceptance criteria:**

- [ ] Double-click tidak membuat dua order
- [ ] Digital-only tidak meminta shipping
- [ ] Order total dihitung server
- [ ] Reservation punya expiry dan release path

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/checkout`
- `apps/api/src/modules/shipping`
- `apps/storefront/src/features/checkout`

**Command verifikasi minimum:**

```bash
deno task test:checkout
deno task test:inventory
deno task build:storefront
deno task quality
```

**External gate:**

- Real shipping provider dapat ditambahkan nanti melalui adapter. Mock harus jelas hanya untuk development/test.

**Prompt siap-tempel:** `../prompts/DAY-29.md`

---

## Hari 30 — Payment adapter, verified webhook, dan Checkout Gate

**Phase:** Cart, Checkout, Payment

**Baca sebelum mulai:**

- `docs/03-storefront/CHECKOUT.md`
- `docs/05-api/ENDPOINTS.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Definisikan PaymentProvider interface dan implement deterministic sandbox/mock provider tanpa menyimpan raw card data.
- **10:15–12:15:** Implement create payment intent/session, payment page handoff, pending/success/failed UI, dan provider reference persistence.
- **13:15–15:15:** Implement webhook signature verification contract, unique provider event, state transition validation, transaction order paid + reservation commit + outbox.
- **15:30–17:30:** Tulis duplicate/out-of-order/invalid-signature tests, browser-success-not-source-of-truth test, quality gate, dan Checkout Gate report.

**Deliverables:**

- Payment provider abstraction
- Payment flow UI/API
- Idempotent verified webhook
- Checkout gate report

**Acceptance criteria:**

- [ ] Order paid hanya lewat event terverifikasi
- [ ] Duplicate webhook aman
- [ ] Invalid signature ditolak
- [ ] Raw payment secret/card data tidak dilog

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/payments`
- `apps/api/src/routes/v1/webhooks.ts`
- `apps/storefront/src/features/checkout/payment`

**Command verifikasi minimum:**

```bash
deno task test:payments
deno task test:checkout
deno task quality
```

**External gate:**

- Pilih dan siapkan payment gateway sandbox untuk integrasi nyata. Sampai tersedia, mock provider harus mencakup success, pending, failed, duplicate, dan invalid webhook.

**Prompt siap-tempel:** `../prompts/DAY-30.md`

---
