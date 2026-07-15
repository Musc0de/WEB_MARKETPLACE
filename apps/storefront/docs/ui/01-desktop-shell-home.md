# Storefront Desktop — Shell dan Home

## Tujuan

Membantu user menemukan produk, kategori, promo, dan melanjutkan cart dengan cepat.

## Route

`shop.starsuperscare.net/`

## Komposisi

Header dua tingkat: utility/announcement opsional, lalu logo, search dominan, kategori, wishlist,
cart, dan account. Main content memakai max-width 1360px. Hero tidak boleh mendorong produk terlalu
jauh ke bawah. Section home: kategori, featured, terbaru, terlaris, digital, rekomendasi, dan
trust/service information.

## Komponen utama

- `StorefrontHeader`
- `DesktopMegaMenu`
- `SearchCombobox`
- `HeroBanner`
- `CategoryRail`
- `ProductCarousel/Grid`
- `RecentlyViewed`
- `StorefrontFooter`

## Interaksi dan validasi

Search membuka suggestion yang dapat dinavigasi keyboard. Cart/account dropdown tidak saling tumpang
tindih. Product carousel mempunyai tombol sebelumnya/berikutnya dan fallback grid tanpa JS
enhancement.

## State wajib

Skeleton home, empty recommendation, image failure, search service error, stale cart badge, session
unknown.

## Gooey Toast

Desktop `top-right`. Add to cart: success + action `Lihat keranjang`. Wishlist: compact
success/info. Search failure: error, sementara inline panel tetap menjelaskan kegagalan.

## Accessibility

Landmark header/nav/main/footer, skip link, mega menu keyboard, carousel controls berlabel, heading
hierarchy satu H1.

## Proposed source map

```text
apps/storefront/src/layouts/storefront-layout.tsx
apps/storefront/src/features/home/pages/home-page.tsx
apps/storefront/src/features/search/components/search-combobox.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
