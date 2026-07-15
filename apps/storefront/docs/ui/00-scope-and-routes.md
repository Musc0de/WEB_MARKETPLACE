# Storefront UI Scope and Routes

Storefront melayani guest dan client yang sedang berbelanja. Cart dan checkout tetap berada di
aplikasi ini.

## Route UI

```text
/
/products
/products/{slug}
/categories/{slug}
/search
/wishlist
/cart
/checkout/address
/checkout/shipping
/checkout/payment
/checkout/review
/checkout/success
```

## Navigation contract

- Logo menuju home storefront.
- Product card menuju detail product.
- Cart badge selalu mengambil jumlah item dari cart state yang sama.
- Account mengarah ke auth atau dashboard sesuai session.
- `return_to` menjaga user kembali ke cart/product setelah login.

## Persona

- Guest browsing.
- Guest checkout.
- Existing client.
- Client dengan wishlist/cart lintas perangkat.
- Pembeli produk digital.
- Pembeli produk fisik atau campuran.
