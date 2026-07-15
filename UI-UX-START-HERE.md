# StarSuperScare UI/UX V2 — Mulai dari Sini

Paket ini adalah lapisan dokumentasi UI/UX yang lengkap di atas blueprint sistem StarSuperScare. Paket ini **tidak mengubah** domain, route, database, API, auth flow, worker, payment flow, atau pembagian aplikasi yang sudah disepakati.

## Cakupan yang sudah didokumentasikan

- Storefront marketplace untuk guest dan client: home, katalog, pencarian, kategori, product card, detail produk, wishlist, cart, checkout, produk fisik, dan produk digital.
- Auth: login, signup, verifikasi email, aktivasi akun otomatis setelah pembelian, lupa password, reset password, dan session/security state.
- Dashboard client: home, profile, security, orders, tracking, history, invoices, downloads, addresses, payment methods, wishlist, notifications, returns, refunds, support, reviews, dan settings.
- Admin: admin login, overview, catalog, products, variants, inventory, orders, payments, invoices, customers, returns/refunds, support, review moderation, audit, table, form, dan bulk action.
- Tracking publik: form tracking, hasil tracking, timeline, error/expired token, dan tampilan mobile.
- Shared design system: tokens, button, form, navigation, table, drawer, modal, feedback, accessibility, responsive primitives, dan Gooey Toast wrapper.

## Urutan baca

1. `docs/01-ui-ux/00-ui-ux-overview.md`
2. `docs/01-ui-ux/02-design-tokens.md`
3. `docs/01-ui-ux/03-responsive-breakpoints.md`
4. `packages/ui/docs/09-design-token-contract.md`
5. `packages/ui/docs/08-code-file-map.md`
6. Dokumen UI aplikasi yang sedang dibangun di `apps/<app>/docs/ui/`
7. Checklist pada `quality/`

## Aturan desktop dan mobile

- Desktop dan mobile mempunyai file spesifikasi yang terpisah.
- Business logic, schema, API client, dan state domain tetap dibagi bersama; yang berbeda adalah komposisi visual dan pola interaksi.
- Desktop mengutamakan informasi berdampingan, tabel, sidebar, keyboard, dan pointer.
- Mobile mengutamakan satu kolom, bottom navigation, drawer/bottom sheet, sticky CTA, safe-area, dan touch target.

## Aturan Gooey Toast

- Package: `goey-toast`.
- Gunakan wrapper lokal dari `packages/ui`, sehingga aplikasi tidak mengimpor API package secara acak.
- Desktop: posisi default `top-right`.
- Mobile: posisi default `bottom-center` dengan offset dari bottom navigation, sticky CTA, keyboard, dan safe-area.
- Toast bukan pengganti inline validation, modal konfirmasi, progress permanen, atau notification center.
- Hanya satu `GooeyToaster` dipasang pada root setiap frontend.

## Urutan implementasi

1. Design tokens dan global CSS.
2. Shared button, form, feedback, overlay, dan responsive primitives.
3. Gooey Toast wrapper dan responsive toaster.
4. Auth UI.
5. Storefront marketplace UI.
6. Dashboard client UI.
7. Admin UI.
8. Tracking UI.
9. Responsive, accessibility, dan visual regression QA.

Lihat `UI-UX-IMPLEMENTATION-ORDER.md` untuk tahapan yang lebih rinci.
