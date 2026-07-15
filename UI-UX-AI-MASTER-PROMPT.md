# UI/UX V2 — AI Master Prompt

Baca seluruh dokumentasi UI/UX sebelum mengedit source code:

- `UI-UX-START-HERE.md`
- `UI-UX-IMPLEMENTATION-ORDER.md`
- `docs/01-ui-ux/*`
- `packages/ui/docs/*`
- folder `apps/<app>/docs/ui/*` untuk app yang sedang dikerjakan
- checklist `quality/04-*` sampai `quality/12-*`

Aturan:

1. Jangan mengubah domain, route, API contract, database schema, auth flow, cart ownership, checkout ownership, payment, worker, atau business rules.
2. Implementasikan satu gate pada satu waktu.
3. Desktop dan mobile memakai domain logic yang sama tetapi composition berbeda.
4. Buat shared token/component pada `packages/ui` sebelum duplikasi di app.
5. Gunakan package `goey-toast` hanya melalui wrapper shared.
6. Mount satu toaster per frontend root.
7. Desktop toast `top-right`; mobile `bottom-center` dengan safe offset.
8. Gooey Toast tidak menggantikan inline validation, modal confirmation, persistent notification, atau payment result page.
9. Jalankan format, lint, check, test, dan build.
10. Laporkan file changed, commands, output, limitations, dan acceptance criteria.
11. Jangan menyatakan berhasil tanpa output aktual.
12. Berhenti setelah gate selesai dan tunggu prompt berikutnya.
