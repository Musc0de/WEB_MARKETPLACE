# Struktur Directory Proyek yang Disarankan

Struktur berikut adalah target repository kode. Dokumen Markdown dalam paket ini ditempatkan pada folder yang sama agar keputusan fitur selalu dekat dengan implementasinya.

```text
starsuperscare/
├── deno.jsonc
├── .env.example
├── README.md
├── apps/
│   ├── storefront/                 # React + Vite: shop.starsuperscare.net
│   │   ├── deno.json
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── features/
│   │   │   │   ├── catalog/
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   └── wishlist/
│   │   │   ├── components/
│   │   │   └── main.tsx
│   │   └── docs/
│   ├── auth/                       # React + Vite: auth.starsuperscare.net
│   │   ├── src/features/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── activation/
│   │   │   └── recovery/
│   │   └── docs/
│   ├── dashboard/                  # React + Vite: dashboard.starsuperscare.net
│   │   ├── src/features/
│   │   │   ├── home/
│   │   │   ├── profile/
│   │   │   ├── orders/
│   │   │   ├── history/
│   │   │   ├── invoices/
│   │   │   ├── downloads/
│   │   │   ├── addresses/
│   │   │   ├── notifications/
│   │   │   ├── returns/
│   │   │   ├── reviews/
│   │   │   ├── support/
│   │   │   └── settings/
│   │   └── docs/
│   ├── admin/                      # React + Vite: admin.starsuperscare.net
│   ├── api/                        # Deno + Hono: api.starsuperscare.net
│   │   ├── src/
│   │   │   ├── routes/v1/
│   │   │   ├── middleware/
│   │   │   ├── modules/
│   │   │   └── main.ts
│   │   └── docs/
│   ├── worker/                     # Email, outbox, invoice, notification jobs
│   └── tracking/                   # Public tracking app
├── packages/
│   ├── database/                   # Drizzle schema, client, migrations, seeds
│   ├── auth/                       # Password, session, CSRF, RBAC helpers
│   ├── ui/                         # Design system dan goey-toast wrapper
│   ├── email/                      # Provider interface dan template
│   ├── contracts/                  # Zod schema dan TypeScript contracts
│   └── config/                     # Environment parser dan shared config
├── migrations/
├── scripts/
├── infrastructure/
└── quality/
```

## Aturan penempatan

- Kode khusus aplikasi berada di `apps/<app>`.
- Kode yang dipakai minimal dua aplikasi berada di `packages/<package>`.
- Database hanya diakses oleh `apps/api` dan `apps/worker`.
- Frontend tidak pernah menggunakan `DATABASE_URL`.
- Dokumen fitur berada di `apps/<app>/docs`.
- Migration bersifat append-only setelah masuk production.
