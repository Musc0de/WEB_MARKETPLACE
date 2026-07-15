# DAY 46: Testing & Coverage Implementations

## 1. Objective
Fokus utama pada Day-46 adalah untuk menyelesaikan error pada saat testing unit & integration untuk e-commerce (cart, orders, refunds, payments, middleware) dan menerapkan Quality Gate untuk Test Coverage menggunakan skrip bawaan Deno.

## 2. Changes Made & Bugs Fixed

### a. Database Foreign Key Constraints (User dependencies)
Pada saat testing komponen seperti Cart atau Support Tickets, skema database memerlukan Foreign Key `userId`. Kami sebelumnya melakukan insert langsung tanpa memperhatikan skema relasi dari `sss_users`.
- **Cart Test (`quality/unit/cart.test.ts`)**: Memperbaiki mock inserter data agar menambahkan `user` sebelum menambahkan object cart.
- **Refund Support Test (`quality/integration/refund_support.test.ts`)**: Sama halnya, membetulkan insersi data ke `users` sebelum mendaftarkan `refund` & `support_tickets`. Disesuaikan dengan schema yang mana tabel users membutuhkan parameter (`usernameDisplay`, `usernameNormalized`, `emailDisplay`, `emailNormalized`).

### b. Typo dan Skema UUID
Terjadi beberapa invalid object input:
- Di `refund_support.test.ts` tipe data return Drizzle ORM menghasilkan conflict pada `crypto.randomUUID()` karena error schema check. Diselesaikan dengan parameter mapping yang benar.
- Di `inventory.test.ts`, kami memperbaiki Deadlock pada database yang disebabkan oleh optimistic concurrency test yang menahan transaction state lalu mengeksekusi outer update.
- Menghapus warning `TS6133: '_t1' is declared but its value is never read` di inventory test.

### c. Webhooks & Path Routing
- Memperbaiki `apps/api/src/routes/v1/webhooks.ts` path namespace dari `/payments` ke `/` dikarenakan route sudah diregistrasikan ke `/webhooks/payments` pada level router `app.ts`.

### d. Deno Configuration (deno.jsonc & check-coverage.ts)
- `deno.jsonc`: Menyempurnakan skrip untuk command test & check agar lebih robust:
  - `test:coverage`: `deno test --env -A --coverage=coverage`
  - `coverage:check`: `deno run -A scripts/check-coverage.ts`
- Skrip kustom `scripts/check-coverage.ts` diatur untuk membaca console output dari `deno coverage` dan mengeksekusi policy quality gate minimum threshold.

## 3. Coverage Results

Hasil coverage untuk sesi Day-46 (pada backend modules & API) mencapai **70.1%** untuk file yang diperiksa, dan beberapa modul seperti database schema, carts, auth token, payments webhook sudah menunjukkan angka yang sangat baik (diatas 80-100%).

Semua tes unit untuk flow kritikal (`commerce_flow.test.ts`, `auth.test.ts`, dsb) telah lolos Quality Checks.

## 4. Next Action
Untuk hari selanjutnya, difokuskan untuk membereskan error pada Test Frontend Storefront React (terutama setup DOM Vite di dalam environment Deno).
