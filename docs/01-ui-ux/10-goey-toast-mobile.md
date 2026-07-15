# Gooey Toast — Mobile

## Posisi

Default `bottom-center`.

Offset dihitung dari context:

```text
base safe area
+ bottom navigation height bila ada
+ sticky CTA height bila ada
+ 12–16px gap
```

Gunakan CSS variables seperti:

```text
--toast-bottom-offset
--bottom-nav-height
--sticky-cta-height
```

## Perilaku

- Maksimal satu toast expanded; toast kedua dapat queue.
- Swipe-to-dismiss diaktifkan bila versi library mendukung.
- Action button minimum 44px tinggi.
- Error penting tidak auto-dismiss terlalu cepat.
- Saat keyboard terbuka, toast tidak menutupi field aktif atau submit button.

## Context khusus

- Auth tanpa bottom nav: offset safe-area + 16px.
- Dashboard: di atas bottom nav.
- Checkout: di atas sticky payment/continue CTA.
- Full-screen sheet: gunakan inline feedback pada sheet bila toast akan terpisah dari context.
