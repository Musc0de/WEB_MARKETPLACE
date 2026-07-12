# Keputusan Teknologi

## Deno workspace

Gunakan monorepo Deno agar aplikasi dan package berbagi lint, format, type-check, test, serta versi dependency.

Contoh root `deno.jsonc`:

```jsonc
{
  "workspace": ["apps/*", "packages/*"],
  "tasks": {
    "check": "deno fmt --check && deno lint && deno check apps/*/src/**/*.ts apps/*/src/**/*.tsx",
    "test": "deno test -A",
    "dev:api": "deno task --cwd apps/api dev",
    "dev:storefront": "deno task --cwd apps/storefront dev",
    "dev:dashboard": "deno task --cwd apps/dashboard dev",
    "db:migrate": "deno task --cwd packages/database migrate"
  }
}
```

## Frontend

- React + Vite untuk storefront, auth, dashboard, dan admin.
- Alasan utama: kompatibilitas langsung dengan `goey-toast` dan ekosistem UI React.
- Gunakan shared UI package untuk button, form, modal, badge, table, skeleton, dan toast wrapper.

## Backend

- Hono berjalan di Deno.
- API mengikuti Web Standards dan dipisahkan per module.
- Validasi request/response memakai Zod contracts dari `packages/contracts`.

## Database

- Neon PostgreSQL sebagai sumber data utama.
- Drizzle untuk typed schema dan migration.
- Runtime memakai pooled connection; migration memakai direct/unpooled connection.
- Gunakan transaction untuk checkout, payment state, order, inventory, dan outbox.

## Async processing

MVP memakai tabel `outbox_events` dan worker yang mengambil job dengan locking. Kafka baru ditambahkan ketika volume, jumlah service, atau kebutuhan replay membuat PostgreSQL queue tidak lagi cukup.

## File storage

Gambar produk, invoice PDF, file digital, dan bukti retur berada di object storage. Database hanya menyimpan key, ukuran, MIME type, checksum, dan metadata akses.
