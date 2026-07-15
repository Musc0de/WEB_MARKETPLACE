# Storefront Mobile — Shell dan Home

## Tujuan

Membuat discovery cepat dengan penggunaan satu tangan dan menjaga cart selalu mudah diakses.

## Route

`shop.starsuperscare.net/`

## Komposisi

Compact top bar: menu/logo/cart/account. Search menjadi bar penuh di bawah header. Section memakai
horizontal rail hanya bila item dapat dipahami; product utama memakai grid dua kolom atau satu kolom
pada 320px. Bottom shortcuts opsional tidak boleh bersaing dengan sticky checkout CTA.

## Komponen utama

- `MobileStorefrontHeader`
- `MobileSearchTrigger/Sheet`
- `CategoryChips`
- `ProductGrid`
- `MobileMenuDrawer`
- `CartBadge`

## Interaksi dan validasi

Menu memakai full-height drawer. Search dapat menjadi dedicated route/sheet. Jangan membuka dropdown
kecil yang sulit disentuh. Horizontal rail snap harus tetap scrollable tanpa gesture khusus.

## State wajib

Mobile skeleton, menu loading, no result, offline banner, cart sync pending.

## Gooey Toast

Mobile `bottom-center`, offset safe-area 16px pada home tanpa bottom nav; bila bottom shortcuts
aktif, offset berada di atasnya.

## Accessibility

Touch target 44px, focus order sesuai DOM, body text minimum 16px, horizontal scroll tidak mengunci
vertical scroll.

## Proposed source map

```text
apps/storefront/src/layouts/mobile-storefront-shell.tsx
apps/storefront/src/features/home/pages/mobile-home-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
