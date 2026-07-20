# StarSuperScare Marketplace — Blueprint Deno + Neon + UI/UX V2

Paket ini memecah rencana StarSuperScare menjadi dokumentasi sistem dan dokumentasi UI/UX per aplikasi, fitur, database, infrastruktur, serta tahap implementasi.

## Arsitektur aplikasi

- `starsuperscare.net`: landing/public information.
- `shop.starsuperscare.net`: storefront, products, search, wishlist, cart, checkout.
- `auth.starsuperscare.net`: login, signup, activation, verification, recovery.
- `dashboard.starsuperscare.net`: area client.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: operasional admin.
- `tracking.starsuperscare.net`: public tracking.
- `apps/worker`: background job internal, tanpa UI publik.

## Stack

Deno workspace, React + Vite, Hono, Neon PostgreSQL, Drizzle, Zod, SSE, transactional outbox, object storage, dan `goey-toast` melalui shared wrapper.

## Dua track dokumentasi

### Sistem

Mulai dari `START-HERE.md` dan `docs/00-overview/` untuk domain, database, API, auth, cart, checkout, payment, worker, dan deployment.

### UI/UX V2

Mulai dari `UI-UX-START-HERE.md` dan `UI-UX-IMPLEMENTATION-ORDER.md`.

UI/UX V2 mencakup:

- Auth login/signup/activation/recovery desktop dan mobile.
- Marketplace storefront untuk guest/client desktop dan mobile.
- Dashboard client seluruh halaman desktop dan mobile.
- Admin seluruh area operasional desktop serta tablet/mobile fallback.
- Tracking publik desktop dan mobile.
- Shared design system dan responsive Gooey Toast.

## Prinsip tetap

- Cart dan checkout berada di storefront.
- Dashboard hanya untuk aktivitas/kepemilikan client dan shortcut kembali ke shop.
- Login client menggunakan username + password.
- Password tidak pernah dikirim lewat email.
- Money integer IDR; time UTC, render id-ID/Asia-Jakarta.
- `Terjual` berasal dari paid quantity dikurangi finalized refunded quantity.
- Database hanya diakses API/worker.

## Cara menerapkan UI/UX patch

Baca `APPLY-UIUX-V2-PATCH.md`. Patch hanya menimpa dokumentasi Markdown dan tidak menimpa source code atau secret.

## Catatan: .git/hooks/pre-commit hanya aktif di mesin ini. Kalau ada developer lain clone ulang, mereka perlu setup hook-nya sendiri. Untuk team, bisa pakai Husky atau simpan hook di folder .hooks/ dan dokumenkan di README.

ENDPOINT API DI DENO https://web-marketplace-gua.musc0de.deno.net

DEPLOY DI VERCEL
Untuk Storefront pilih: apps/storefront
https://web-marketplace-ashen.vercel.app/ <-- Vercel buat Storefront
Build Command: curl -fsSL https://deno.land/install.sh | sh && ~/.deno/bin/deno task build:storefront
Output Directory: apps/storefront/dist
Install Command: echo "skip" (Ketik kata "echo skip" ini, karena Deno tidak butuh npm install, dia akan install otomatis nanti).

Untuk Auth pilih: apps/auth
https://web-marketplace-auth.vercel.app/ <-- Vercel buat Auth
Build Command: curl -fsSL https://deno.land/install.sh | sh && ~/.deno/bin/deno task build:auth
Output Directory: apps/auth/dist
Install Command: echo "skip"

Untuk Dashboard pilih: apps/dashboard
https://web-marketplace-dashboard.vercel.app/ <-- Vercel buat Dashboard
Build Command: curl -fsSL https://deno.land/install.sh | sh && ~/.deno/bin/deno task build:dashboard
Output Directory: apps/dashboard/dist
Install Command: echo "skip"

Untuk Admin pilih: apps/admin
https://web-marketplace-wp3a.vercel.app/ <-- Vercel buat Admin
Build Command: curl -fsSL https://deno.land/install.sh | sh && ~/.deno/bin/deno task build:admin
Output Directory: apps/admin/dist
Install Command: echo "skip"

Untuk Tracking pilih: apps/tracking
https://web-marketplace-mmlt.vercel.app/ <-- Vercel buat Tracking
Build Command: curl -fsSL https://deno.land/install.sh | sh && ~/.deno/bin/deno task build:tracking
Output Directory: apps/tracking/dist
Install Command: echo "skip"
