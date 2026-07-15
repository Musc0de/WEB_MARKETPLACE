# UI/UX V2 — Urutan Implementasi

Dokumen ini memecah implementasi UI/UX menjadi gate kecil agar AI atau developer tidak membangun seluruh tampilan sekaligus.

## Gate 1 — Shared foundation

File rujukan:

- `docs/01-ui-ux/02-design-tokens.md`
- `docs/01-ui-ux/03-responsive-breakpoints.md`
- `packages/ui/docs/02-button-system.md`
- `packages/ui/docs/05-form-components.md`
- `packages/ui/docs/09-design-token-contract.md`

Hasil:

- Token warna, spacing, radius, typography, shadow, z-index, dan motion.
- Global reset dan focus style.
- Button, input, select, textarea, checkbox, radio, switch, badge, skeleton, spinner.
- Tidak ada halaman bisnis pada gate ini.

## Gate 2 — Layout dan navigation

Hasil:

- Storefront shell desktop/mobile.
- Auth shell desktop/mobile.
- Dashboard shell desktop/mobile.
- Admin shell desktop/tablet-mobile.
- Tracking shell desktop/mobile.
- Header, sidebar, bottom navigation, breadcrumb, page header, drawer.

## Gate 3 — Feedback dan Gooey Toast

Hasil:

- `ResponsiveGooeyToaster` satu kali per app.
- Wrapper `notify` untuk success, error, warning, info, promise, update, dan dismiss.
- Desktop `top-right`; mobile `bottom-center`.
- Inline error tetap berada dekat field.
- Modal konfirmasi tetap digunakan untuk destructive action.

## Gate 4 — Auth

Urutan halaman:

1. Login desktop/mobile.
2. Signup desktop/mobile.
3. Verify email dan activation desktop/mobile.
4. Forgot/reset password desktop/mobile.
5. Session expired, rate limited, disabled account, dan recovery states.

## Gate 5 — Storefront marketplace

Urutan halaman:

1. Home/shell desktop/mobile.
2. Product listing desktop/mobile.
3. Product card.
4. Product detail desktop/mobile.
5. Search/category/wishlist desktop/mobile.
6. Cart desktop/mobile.
7. Checkout desktop/mobile.
8. Guest/account merge dan physical/digital states.

## Gate 6 — Dashboard client

Urutan halaman:

1. Shell dan home.
2. Profile/security.
3. Orders/tracking.
4. History/invoices/downloads.
5. Addresses/wishlist/payment methods.
6. Notifications.
7. Returns/refunds.
8. Support/reviews/settings.

## Gate 7 — Admin

Urutan halaman:

1. Admin login dan shell.
2. Overview.
3. Catalog/products/variants.
4. Inventory.
5. Orders/payments/invoices.
6. Customers/support/reviews.
7. Bulk action, audit, and responsive operational patterns.

## Gate 8 — Tracking dan final QA

Hasil:

- Tracking form dan timeline.
- Empty/loading/error/offline states.
- Accessibility keyboard/screen-reader test.
- Responsive matrix.
- Visual regression.
- Cross-app consistency audit.

## Gate rule

Jangan lanjut ke gate berikutnya sebelum:

- `deno fmt --check` lulus.
- `deno lint` lulus.
- `deno task check` lulus.
- Test komponen terkait lulus.
- Tampilan desktop dan mobile diperiksa pada matrix viewport.
