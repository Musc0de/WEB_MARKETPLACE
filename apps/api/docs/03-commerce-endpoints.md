# Catalog, Cart, Checkout, dan Order Endpoints

## Catalog

```text
GET /v1/products
GET /v1/products/{slug}
GET /v1/categories
GET /v1/search
GET /v1/products/{id}/reviews
```

## Cart

```text
GET    /v1/cart
POST   /v1/cart/items
PATCH  /v1/cart/items/{item_id}
DELETE /v1/cart/items/{item_id}
DELETE /v1/cart
POST   /v1/cart/merge
POST   /v1/cart/apply-voucher
```

## Checkout

```text
POST /v1/checkout/validate
POST /v1/checkout/shipping-quotes
POST /v1/checkout/orders
GET  /v1/checkout/orders/{order_number}/status
```

## Client order

```text
GET /v1/me/orders
GET /v1/me/orders/{order_number}
GET /v1/me/orders/{order_number}/tracking
POST /v1/me/orders/{order_number}/buy-again
```

## Rules

- Server menghitung total.
- Order item menyimpan snapshot name, SKU, variant, price, discount, tax, dan image.
- Stock reservation memiliki expiry dan release job.
