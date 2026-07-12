# Bootstrap Deno Workspace

## Langkah 1 — Buat folder

```bash
mkdir starsuperscare
cd starsuperscare
mkdir -p apps/{storefront,auth,dashboard,admin,api,worker}
mkdir -p packages/{database,auth,ui,email,contracts,config}
```

## Langkah 2 — Inisialisasi root

Buat `deno.jsonc` dengan workspace `apps/*` dan `packages/*`. Aktifkan formatter, linter, tasks, dan
dependency catalog.

## Langkah 3 — Frontend apps

Buat React + Vite di `storefront`, `auth`, `dashboard`, dan `admin`. Setiap app memiliki:

```text
src/app/
src/pages/
src/features/
src/components/
src/lib/
src/main.tsx
```

## Langkah 4 — API dan worker

- `apps/api`: Hono routes dan middleware.
- `apps/worker`: loop pemrosesan outbox dan scheduled maintenance.
- Berikan permission Deno sekecil mungkin saat production.

## Langkah 5 — Shared packages

- `database`: schema, query, migration.
- `contracts`: Zod request/response.
- `auth`: hashing, session, CSRF, RBAC.
- `ui`: shared components dan toast.
- `email`: templates dan provider adapter.
- `config`: typed environment configuration.

## Langkah 6 — Perintah wajib CI

```text
deno fmt --check
deno lint
deno check
deno test
deno task build
```

## Langkah 7 — Aturan dependency

- Pin versi dependency melalui lockfile/catalog.
- Frontend boleh mengimpor `ui`, `contracts`, dan `config-public`.
- API/worker boleh mengimpor seluruh package server.
- Package database tidak boleh masuk browser bundle.
