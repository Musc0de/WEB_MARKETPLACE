# Admin App

**Domain:** `admin.starsuperscare.net`

## Module MVP

- Products, variants, category, brand, image.
- Pricing, promotion, voucher.
- Inventory dan movement.
- Orders, shipments, payments, invoices.
- Returns/refunds.
- Client users dan account status.
- Reviews moderation.
- Support tickets.
- Notification/email delivery logs.
- Audit log.

## Route contoh

```text
/products
/products/create
/products/{id}/edit
/products/{id}/variants
/products/{id}/inventory
/orders/{order_number}
/customers/{user_id}
/returns/{return_number}
```

## Security

- Admin session terpisah atau scope role yang ketat.
- MFA sangat direkomendasikan.
- Setiap perubahan sensitif menghasilkan audit event.
- Admin tidak dapat melihat password, raw session token, atau raw payment credential.
