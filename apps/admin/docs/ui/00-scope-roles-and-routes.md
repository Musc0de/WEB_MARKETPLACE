# Admin UI Scope, Roles, and Routes

Admin UI diprioritaskan untuk desktop/tablet. Mobile mendukung monitoring dan action ringan;
bulk/risk-heavy operations dapat meminta desktop.

## Area

```text
/login
/overview
/products
/categories
/brands
/inventory
/orders
/payments
/invoices
/customers
/returns
/refunds
/support
/reviews
/audit
/settings
```

## Role-aware UI

Navigation dan action dapat disembunyikan berdasarkan role, tetapi authorization selalu diverifikasi
server. Disabled/hidden UI bukan security control.
