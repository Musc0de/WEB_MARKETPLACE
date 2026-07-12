# Minggu 5 — Storefront products, search, wishlist

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

## Hari 21 — Storefront shell, design system, API client, dan goey-toast wrapper

**Phase:** Storefront

**Baca sebelum mulai:**

- `apps/storefront/README.md`
- `packages/ui/README.md`
- `docs/07-ui/GOOEY-TOAST.md`
- `docs/07-ui/GOOEY-TOAST.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun design tokens, typography, spacing, buttons, forms, cards, skeleton, dialog, pagination, badge, dan responsive containers di packages/ui.
- **10:15–12:15:** Buat wrapper goey-toast terstandar untuk success/error/warning/info/promise, reduced-motion support, dan pesan Indonesia yang konsisten.
- **13:15–15:15:** Bangun storefront header/nav/search/cart/account shell, API client typed, currency/date/sold formatter, dan error boundary.
- **15:30–17:30:** Buat component tests/smoke page, audit keyboard/focus, dan build storefront baseline.

**Deliverables:**

- Shared UI foundation
- Goey-toast wrapper
- Storefront shell
- Formatter helpers

**Acceptance criteria:**

- [ ] Toast bukan pengganti persistent notification
- [ ] Reduced motion dihormati
- [ ] Currency IDR tanpa floating point
- [ ] Komponen keyboard-accessible

**File/folder utama yang diperkirakan berubah:**

- `packages/ui/src`
- `apps/storefront/src/app`
- `apps/storefront/src/lib/api.ts`
- `packages/ui/src/toast.tsx`

**Command verifikasi minimum:**

```bash
deno task test:ui
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-21.md`

---

## Hari 22 — Product list dan product card final

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/PRODUCTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /products data loader/query state dan URL pagination per_page=12 dengan cancellation serta cache policy sederhana.
- **10:15–12:15:** Bangun ProductCard berisi image, name, brand, category, regular/selling price, discount, rating, review count, net sold, stock, badges, dan wishlist state.
- **13:15–15:15:** Implement add-to-cart/buy-now/wishlist action stubs yang terhubung kontrak, responsive grid, skeleton, empty/error/out-of-stock states.
- **15:30–17:30:** Tulis component/integration tests untuk sold label, price discount, stock, new badge, action accessibility, dan mobile layout.

**Deliverables:**

- Products page
- Final ProductCard
- Responsive states
- Product card tests

**Acceptance criteria:**

- [ ] Tampilan memuat Terjual dan Stok
- [ ] Terjual 0 dapat diganti Baru sesuai rule
- [ ] Harga normal/promo jelas
- [ ] Out-of-stock mencegah CTA invalid

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/catalog/pages/ProductsPage.tsx`
- `apps/storefront/src/features/catalog/components/ProductCard.tsx`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-22.md`

---

## Hari 23 — Product detail, variants, gallery, reviews, dan related products

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/PRODUCTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /products/{slug} loader dengan not-found/inactive states dan metadata dasar.
- **10:15–12:15:** Bangun gallery, product summary, variant selector, effective price, stock, quantity limits, add-cart, buy-now, wishlist, dan shipping/digital indicator.
- **13:15–15:15:** Bangun tabs/accordion description, benefits, composition, usage, warning, shipping, reviews, serta related products.
- **15:30–17:30:** Tulis tests untuk variant URL/state, sold/stock display, quantity clamping, image alt, and out-of-stock behavior.

**Deliverables:**

- Product detail page
- Variant-aware CTA
- Review display
- Related products

**Acceptance criteria:**

- [ ] Cart action selalu membawa variant_id
- [ ] Harga/stok berubah saat variant berubah
- [ ] Semua image punya alt
- [ ] Inactive slug memberi 404 aman

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/catalog/pages/ProductDetailPage.tsx`
- `apps/storefront/src/features/catalog/components`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-23.md`

---

## Hari 24 — Search, category, brand, filters, sort, dan URL state

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/PRODUCTS.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun /search, /categories/{slug}, dan /brands/{slug} menggunakan endpoint yang sama dan URL query sebagai source of truth.
- **10:15–12:15:** Implement keyword debounce, filter category/brand/price/stock/rating/promo, sort allowlist, reset filter, dan mobile filter drawer.
- **13:15–15:15:** Jaga browser back/forward, shareable URLs, page reset saat filter berubah, serta empty suggestions/popular products.
- **15:30–17:30:** Tulis query-state tests, accessibility, and API error recovery; build storefront.

**Deliverables:**

- Search page
- Category/brand listing
- Filter/sort UI
- URL-state tests

**Acceptance criteria:**

- [ ] URL dapat dibagikan dan direstore
- [ ] Invalid query jatuh ke default aman
- [ ] Filter tidak menghapus parameter yang relevan
- [ ] Mobile controls accessible

**File/folder utama yang diperkirakan berubah:**

- `apps/storefront/src/features/search`
- `apps/storefront/src/features/catalog/filters`

**Command verifikasi minimum:**

```bash
deno task test:storefront
deno task build:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-24.md`

---

## Hari 25 — Wishlist guest/account dan Storefront Gate

**Phase:** Storefront

**Baca sebelum mulai:**

- `docs/03-storefront/PRODUCTS.md`
- `docs/03-storefront/CART.md`
- `docs/10-testing/TEST-PLAN.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement guest wishlist local storage dengan versioned schema, graceful corruption handling, dan no-sensitive-data rule.
- **10:15–12:15:** Implement account wishlist API list/add/remove, ownership, duplicate prevention, stock/price projection, dan optional merge after login.
- **13:15–15:15:** Integrasikan heart state pada list/detail, optimistic update rollback, goey-toast, dan dashboard deep link.
- **15:30–17:30:** Jalankan storefront tests, accessibility smoke, performance baseline, dan tulis Storefront Gate report.

**Deliverables:**

- Guest wishlist
- Account wishlist API
- Wishlist UI integration
- Storefront gate report

**Acceptance criteria:**

- [ ] Guest wishlist tetap setelah refresh
- [ ] User hanya melihat wishlist sendiri
- [ ] Optimistic failure di-rollback
- [ ] Product data tetap berasal dari server

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/wishlist`
- `apps/storefront/src/features/wishlist`
- `packages/contracts/src/wishlist.ts`

**Command verifikasi minimum:**

```bash
deno task test:wishlist
deno task test:storefront
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-25.md`

---
