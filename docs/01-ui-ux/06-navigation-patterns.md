# Navigation Patterns

## Storefront

Desktop: logo, categories, search, wishlist, cart, account. Mobile: compact header, search row, cart badge, account/menu.

## Auth

Navigation minimal. Logo kembali ke shop; secondary link menghubungkan login dan signup. Jangan tampilkan full marketplace navigation yang mengganggu completion.

## Dashboard

Desktop sidebar dengan section grouping. Mobile bottom navigation untuk lima destination utama, sedangkan halaman sekunder berada pada Account/More.

## Admin

Desktop sidebar + command/search. Tablet/mobile menggunakan drawer. Active state harus jelas tanpa bergantung pada warna saja.

## Breadcrumb

Gunakan pada detail yang lebih dari satu tingkat, khususnya admin, dashboard order detail, dan product category. Mobile dapat memperpendek breadcrumb menjadi tombol back + title.

## Deep link

Refresh pada route SPA harus tetap membuka halaman yang benar. Redirect login menyimpan `return_to` yang telah divalidasi.
