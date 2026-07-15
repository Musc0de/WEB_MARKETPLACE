# Admin Catalog dan Products — Desktop

## Tujuan

Mengelola product, variant, image, price, publish status, dan metadata dengan auditability.

## Route

`/products`, `/products/{id}`, `/categories`, `/brands`

## Komposisi

Product table with filters/search/bulk actions. Editor page uses sections/tabs: Basic, Media,
Variants, Pricing, Inventory summary, Digital delivery, SEO, Status. Sticky save/publish rail and
unsaved changes indicator.

## Komponen utama

Data table, bulk toolbar, product editor, media uploader, variant matrix, price fields, publish
panel, audit drawer.

## Interaksi dan validasi

Draft autosave only if designed; explicit Save required for critical state. Publish validates
required fields. Slug conflict handled. Bulk action confirmation names count and scope.

## State wajib

Empty catalog, draft, validation, upload failure, conflict, publishing, archived/discontinued.

## Gooey Toast

Save/publish promise; upload progress; batch result summary with View failures.

## Accessibility

Table keyboard, form error summary, uploader, tabs, unsaved state, destructive dialog.

## Proposed source map

```text
apps/admin/src/features/catalog/pages/products-page.tsx
apps/admin/src/features/catalog/pages/product-editor-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
