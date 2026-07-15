# Mobile Layout System

## Struktur dasar

```text
Top bar
Context/header
Scrollable content
Sticky CTA bila diperlukan
Bottom navigation bila app menggunakan navigation utama
Gooey Toast di atas semua elemen bawah
```

## Spacing

- Horizontal padding 16px; 12px hanya untuk device sangat kecil.
- Touch target minimum 44×44px.
- Gap antar action utama minimal 8px.

## Navigation

- Storefront: top bar + search, optional bottom shortcuts.
- Dashboard: bottom nav `Home | Orders | Cart/Shop | Notifications | Account`.
- Admin: hamburger + drawer; mobile diprioritaskan untuk monitoring dan action ringan.

## Sticky CTA

Gunakan untuk Add to Cart, Checkout, Pay, Submit Return, atau Save yang panjang. CTA harus berpindah di atas keyboard saat form input aktif atau dinonaktifkan bila tertutup keyboard.

## Sheets

Filter, sort, variant selection, address picker, dan compact action menu menggunakan bottom sheet dengan focus trap dan drag handle non-esensial.
