# Schema Catalog dan Inventory

## Tables

- `stores` — single row pada MVP, siap multi-store.
- `brands`.
- `categories` dan optional hierarchy.
- `products` — name, slug, type, description, status, published_at.
- `product_variants` — SKU, option values, price, compare price, weight/dimension.
- `product_images`.
- `product_categories`.
- `inventory_locations`.
- `inventory_levels` — available, reserved, damaged.
- `inventory_movements` — immutable ledger.
- `digital_assets` — object key, version, checksum, limits.
- `product_sales_stats` — cached gross/refunded/net sold.
- `product_rating_stats` — cached rating/review count.

## Status product

```text
draft | active | inactive | archived | discontinued
```

## Stock

Stock tidak boleh hanya berupa satu angka yang diubah tanpa ledger. Mutation penting membuat
`inventory_movement` dengan reference order/return/admin adjustment.

## Slug

`products.slug` unique untuk active canonical URL. Simpan `product_slug_redirects` untuk slug lama.
