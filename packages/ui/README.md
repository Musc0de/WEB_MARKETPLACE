# Shared UI Package

## Isi

- Design tokens.
- Button, input, select, dialog, drawer.
- Product card.
- Status badge.
- Currency/date formatter.
- Data table dan pagination.
- Empty/error/loading states.
- Toast wrapper.

## Aturan

- Komponen business-specific tetap di feature app.
- Shared component harus accessible.
- Support reduced motion.
- Gunakan semantic HTML dan focus management.
- Currency formatter memakai `Intl.NumberFormat('id-ID', { currency: 'IDR' })`.
- Date formatter memakai `Asia/Jakarta` di presentation layer.

## UI/UX V2

Shared UI contract berada di `docs/01-goey-toast.md` sampai `docs/15-toast-event-policy.md`.
Implementasi aplikasi harus memakai shared tokens, components, layout, feedback, dan accessibility
contract ini.
