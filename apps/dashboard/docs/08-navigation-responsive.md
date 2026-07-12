# Navigasi dan Responsive

## Desktop sidebar

Kelompokkan menu menjadi:

1. Ringkasan: Dashboard.
2. Belanja: Orders, History, Invoice, Downloads, Wishlist.
3. Akun: Address, Reviews, Notifications.
4. Bantuan: Return/Refund, Support.
5. Sistem: Settings, Logout.

## Mobile

Bottom nav maksimal lima item: Home, Orders, Cart, Notifications, Account. Menu lain masuk Account/More.

## Cross-domain links

- `Cart` dan `Kembali Belanja` menuju `shop`.
- Logo dashboard menuju dashboard home, bukan storefront.
- Breadcrumb detail order selalu kembali ke orders.

## UX states

Setiap route wajib memiliki loading, empty, partial error, authorization error, dan retry. Gunakan toast untuk feedback singkat; gunakan inline alert untuk error yang harus dibaca sebelum lanjut.
