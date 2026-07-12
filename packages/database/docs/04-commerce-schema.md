# Schema Commerce

## Cart

- `carts`: guest token hash atau user ID, status, expiry.
- `cart_items`: variant, quantity, selected, note.
- Harga final tidak dipercaya dari cart client.

## Orders

- `orders`: number, user/email snapshot, totals, statuses, timestamps.
- `order_items`: product/variant IDs + full snapshot.
- `order_addresses`: shipping/billing snapshot.
- `order_status_history`.

## Payment dan invoice

- `payment_attempts`.
- `payment_transactions`.
- `webhook_events`.
- `invoices` dan `invoice_items` atau referensi snapshot order.
- `refunds` dan `refund_items`.

## Fulfillment

- `shipments`, `shipment_items`, `shipment_events`.
- `digital_entitlements`, `download_events`.

## Saved payment methods

- `customer_payment_methods` menyimpan provider token/reference dan display metadata saja.
- Jangan menyimpan nomor kartu penuh, CVV, PIN, OTP, atau raw banking credential.

## Wishlist/reviews

- `wishlists`, `wishlist_items`.
- `reviews` terhubung ke user, product, dan order item.

## Constraints penting

- Unique order number dan invoice number.
- Unique provider event ID.
- Unique review per order item.
- Quantity > 0.
- Totals tidak negatif.
- Payment/order transition dijaga service + database constraints yang sesuai.
