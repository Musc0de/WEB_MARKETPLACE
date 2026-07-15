# Guest and Account UI States

## Guest browsing

Tidak ada forced login untuk melihat produk, wishlist lokal, atau menambah cart.

## Login trigger

Login diminta ketika fitur benar-benar membutuhkan identity, misalnya melihat dashboard atau memakai
saved payment method. Checkout guest dapat tetap tersedia sesuai business rule.

## Cart merge

Setelah login:

1. Tampilkan non-blocking progress.
2. Merge server-side.
3. Konflik stock/price ditampilkan per item.
4. Summary toast hanya setelah hasil final.
5. Jangan menghapus guest cart sebelum merge committed.

## Account auto-provision after payment

Success page menjelaskan bahwa email invoice dan activation link akan dikirim. Jangan menampilkan
password temporary. Bila email delivery pending, tampilkan status dan support path.

## Session expiration

Pertahankan cart/checkout draft, arahkan ke login dengan valid `return_to`, lalu lanjutkan flow
setelah session pulih.
