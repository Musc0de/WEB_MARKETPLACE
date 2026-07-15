# Admin Catalog dan Products — Mobile

## Tujuan

Mendukung lookup, quick status changes, dan limited editing pada mobile.

## Route

`/products`, `/products/{id}`

## Komposisi

Product list as cards with image, title, SKU, status, price, stock. Filters in sheet. Editor
sections stacked; media/variant matrix complex operations may indicate desktop recommended.

## Komponen utama

Product cards, filter sheet, status action sheet, basic editor, image viewer.

## Interaksi dan validasi

Quick publish/unpublish requires confirmation and permission. Long forms preserve draft. Avoid bulk
edit on small screen.

## State wajib

Empty, loading, upload limited, conflict, desktop-required.

## Gooey Toast

Bottom-center above sticky save. Publish result persistent in page.

## Accessibility

Touch controls, no truncated-only identifiers, status text.

## Proposed source map

```text
apps/admin/src/features/catalog/pages/mobile-products-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
