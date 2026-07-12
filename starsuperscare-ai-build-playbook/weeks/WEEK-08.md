# Minggu 8 — Dashboard client

## Arsitektur yang tidak boleh diubah

- `starsuperscare.net`: landing dan halaman informasi publik.
- `shop.starsuperscare.net`: products, product detail, category/search, cart, checkout, dan guest
  wishlist.
- `auth.starsuperscare.net`: login, signup, verifikasi, aktivasi, forgot/reset, dan logout.
- `dashboard.starsuperscare.net`: area client setelah login.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: operasi admin.
- `tracking.starsuperscare.net`: tracking publik dengan token opaque.
- `assets.starsuperscare.net`: target aset publik/CDN bila dipakai.
- `apps/worker`: proses internal; tidak mempunyai subdomain publik.

Cart dan checkout tidak dipindahkan ke dashboard. Database hanya boleh diakses oleh `apps/api` dan
`apps/worker` melalui `packages/database`.

## Hari 36 — Dashboard shell, route guards, navigation, dan home summary

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `apps/dashboard/README.md`
- `docs/04-dashboard/README.md`
- `docs/04-dashboard/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun dashboard API client/session bootstrap, protected route guard,
  unauthorized/expired flow, error boundary, dan app layout.
- **10:15–12:15:** Bangun desktop sidebar sesuai blueprint dan mobile nav
  Home/Orders/Cart/Notifications/Account; Cart link kembali ke shop.
- **13:15–15:15:** Implement home summary endpoint dan UI: active orders, latest, shipping, total
  purchases, unread notification, unpaid status, recommendation link.
- **15:30–17:30:** Tulis dashboard shell/home tests, loading/empty/error states, accessibility, and
  responsive build.

**Deliverables:**

- Protected dashboard shell
- Desktop/mobile navigation
- Home summary API/UI
- Dashboard baseline tests

**Acceptance criteria:**

- [ ] Unauthenticated diarahkan ke auth dengan safe return_to
- [ ] Cart tidak dipindah ke dashboard
- [ ] Total IDR server-derived
- [ ] Mobile nav sesuai blueprint

**File/folder utama yang diperkirakan berubah:**

- `apps/dashboard/src/app`
- `apps/dashboard/src/features/home`
- `apps/api/src/modules/dashboard/home.ts`

**Command verifikasi minimum:**

```bash
deno task test:dashboard
deno task build:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-36.md`

---

## Hari 37 — Profile, security, sessions, addresses, dan payment method metadata

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/04-dashboard/README.md`
- `docs/04-dashboard/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement GET/PATCH /me dan profile UI untuk name, email display/policy, phone,
  avatar metadata, joined date, and validation.
- **10:15–12:15:** Implement change password, sessions list, revoke one/all other sessions, login
  history summary, and security feedback.
- **13:15–15:15:** Implement addresses CRUD/default shipping/billing with ownership and dashboard
  UI.
- **15:30–17:30:** Implement tokenized payment-method metadata list/delete only if provider supports
  it; no raw card data; test ownership and responsive forms.

**Deliverables:**

- Profile UI/API
- Security/session management
- Address CRUD
- Payment method metadata

**Acceptance criteria:**

- [ ] Password lama diverifikasi
- [ ] Password tidak ditampilkan
- [ ] Session revoke efektif
- [ ] Card PAN/CVV tidak tersimpan

**File/folder utama yang diperkirakan berubah:**

- `apps/dashboard/src/features/profile`
- `apps/dashboard/src/features/addresses`
- `apps/dashboard/src/features/payment-methods`
- `apps/api/src/modules/me`

**Command verifikasi minimum:**

```bash
deno task test:dashboard
deno task test:auth
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-37.md`

---

## Hari 38 — Orders list, detail, tracking, buy-again, dan invoice link

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`
- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement user-scoped orders list with tabs
  Semua/Aktif/Selesai/Dibatalkan/Refund, stable pagination, and summary fields.
- **10:15–12:15:** Implement order detail endpoint/UI with snapshots, payment/shipping/status
  timeline, totals, invoice and product links.
- **13:15–15:15:** Implement tracking endpoint/UI and buy-again service yang revalidasi
  product/variant/price/stock sebelum menambah cart.
- **15:30–17:30:** Tulis ownership/IDOR tests, status display, mixed digital/physical tracking,
  buy-again warnings, and responsive detail tests.

**Deliverables:**

- Orders list/detail
- Tracking timeline
- Buy again
- Order ownership tests

**Acceptance criteria:**

- [ ] User hanya membaca order sendiri
- [ ] Order number bukan authorization
- [ ] Buy-again tidak memakai harga lama
- [ ] Detail tidak bergantung pada product aktif

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/orders`
- `apps/dashboard/src/features/orders`

**Command verifikasi minimum:**

```bash
deno task test:orders
deno task test:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-38.md`

---

## Hari 39 — History, invoices, dan digital downloads

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`
- `docs/04-dashboard/ORDERS-HISTORY-INVOICES.md`

**Jadwal per jam:**

- **08:00–10:00:** Implement /history default per_page=5 dengan status/year/start_date/end_date,
  total transactions/nominal/completed/refund summary.
- **10:15–12:15:** Bangun history UI, filter URL state, IDR/time formatting id-ID Asia/Jakarta,
  buy-again, review, and invoice actions.
- **13:15–15:15:** Implement invoices list/detail/download authorization dan signed/streamed private
  file access.
- **15:30–17:30:** Implement digital entitlements/download list, expiry/download-count checks,
  secure download, and tests for ownership/tampering.

**Deliverables:**

- History API/UI
- Invoice center
- Secure invoice download
- Digital downloads

**Acceptance criteria:**

- [ ] Pagination default 5
- [ ] Date input canonical dan timezone-safe
- [ ] File access user-scoped
- [ ] Download entitlement enforced

**File/folder utama yang diperkirakan berubah:**

- `apps/api/src/modules/history`
- `apps/api/src/modules/invoices`
- `apps/api/src/modules/downloads`
- `apps/dashboard/src/features/history`

**Command verifikasi minimum:**

```bash
deno task test:history
deno task test:invoices
deno task build:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-39.md`

---

## Hari 40 — Notifications, wishlist, reviews, settings, dan Dashboard Gate

**Phase:** Dashboard client

**Baca sebelum mulai:**

- `docs/04-dashboard/README.md`
- `docs/04-dashboard/NOTIFICATIONS.md`
- `docs/04-dashboard/README.md`

**Jadwal per jam:**

- **08:00–10:00:** Bangun notification center list/read/read-all/unread badge dan SSE listener
  dengan reconnect, REST refresh, and goey-toast for live events.
- **10:15–12:15:** Bangun account wishlist page dengan stock/price projection,
  remove/add-cart/product links.
- **13:15–15:15:** Implement eligible verified-purchase reviews list/create/edit/delete policy dan
  settings profile/security/notification/privacy shells.
- **15:30–17:30:** Jalankan dashboard tests, accessibility/mobile audit, build, dan tulis Dashboard
  Gate report.

**Deliverables:**

- Notification center + SSE
- Wishlist dashboard
- Reviews lifecycle
- Settings and dashboard gate

**Acceptance criteria:**

- [ ] Toast live tidak menggantikan database record
- [ ] Review hanya untuk eligible order item
- [ ] Unread badge pulih setelah reconnect
- [ ] Semua route mobile usable

**File/folder utama yang diperkirakan berubah:**

- `apps/dashboard/src/features/notifications`
- `apps/dashboard/src/features/wishlist`
- `apps/dashboard/src/features/reviews`
- `apps/dashboard/src/features/settings`

**Command verifikasi minimum:**

```bash
deno task test:dashboard
deno task build:dashboard
deno task quality
```

**Prompt siap-tempel:** `../prompts/DAY-40.md`

---
