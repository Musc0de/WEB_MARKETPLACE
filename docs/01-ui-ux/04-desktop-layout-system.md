# Desktop Layout System

## Container

- Storefront: max-width 1280–1440px.
- Auth: card 420–520px atau split 40/60.
- Dashboard: sidebar 248–280px + content fluid.
- Admin: sidebar 240–272px + content fluid sampai 1600px.

## Grid

- Product grid: 3–5 kolom berdasarkan container.
- Dashboard summary: 3–4 cards.
- Form: label/field satu kolom; field terkait dapat dua kolom.
- Detail page: primary content + sticky summary/action rail.

## Persistent elements

- Header tidak boleh menutupi anchor/focus target.
- Sidebar dapat collapse tetapi label tetap tersedia melalui tooltip.
- Sticky summary tidak melewati tinggi viewport; area internal dapat scroll.

## Interaction

- Hover hanya enhancement, bukan satu-satunya cara menemukan action.
- Keyboard shortcut hanya untuk admin dan harus didokumentasikan.
- Dropdown ditutup dengan Escape dan focus kembali ke trigger.
