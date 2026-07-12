# StarSuperScare Marketplace — Blueprint Deno + Neon

Paket ini memecah rencana marketplace StarSuperScare menjadi dokumen Markdown per aplikasi, fitur, database, infrastruktur, dan tahap implementasi.

## Keputusan arsitektur final

- `starsuperscare.net`: landing page dan halaman informasi publik.
- `shop.starsuperscare.net`: katalog produk, detail produk, cart, checkout, pencarian, dan wishlist sementara.
- `auth.starsuperscare.net`: login, signup, aktivasi akun, lupa password, dan reset password.
- `dashboard.starsuperscare.net`: akun client, order, history, invoice, download digital, alamat, notifikasi, retur, ulasan, support, dan settings.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: pengelolaan produk, stok, order, pembayaran, client, refund, dan konten.
- `assets.starsuperscare.net`: gambar produk, bukti retur, dan file publik.
- `tracking.starsuperscare.net`: tracking publik menggunakan token aman.

## Stack yang dipilih

- Runtime dan workspace: Deno.
- Frontend: React + Vite agar `goey-toast` dapat dipakai langsung.
- Backend API: Hono di Deno.
- Database: Neon PostgreSQL.
- ORM dan migration: Drizzle ORM/Kit.
- Validasi kontrak: Zod.
- Realtime dashboard: Server-Sent Events (SSE).
- Pekerjaan async: Deno worker + transactional outbox PostgreSQL.
- File besar: object storage; Neon hanya menyimpan metadata.

## Cara membaca dokumen

1. Mulai dari `docs/00-overview/`.
2. Ikuti `04-implementation-roadmap.md` sesuai urutan fase.
3. Baca `apps/<nama-aplikasi>/README.md` sebelum mengerjakan aplikasinya.
4. Gunakan dokumen di `packages/database/` saat membuat tabel dan migration.
5. Jalankan skenario di `quality/` sebelum release.

## Prinsip utama

- Cart dan checkout berada di `shop`, bukan dashboard.
- Dashboard hanya menampilkan aktivitas dan kepemilikan client.
- Login memakai **username + password**; email dipakai untuk invoice, aktivasi, recovery, dan notifikasi.
- Akun guest dapat dibuat otomatis setelah pembayaran sukses, tetapi password tidak pernah dikirim melalui email. Client menerima tautan aktivasi untuk membuat password sendiri.
- Semua nilai uang disimpan sebagai integer rupiah.
- Semua waktu disimpan sebagai UTC dan ditampilkan dengan locale `id-ID`, zona `Asia/Jakarta`.
- Informasi `Terjual` berasal dari transaksi berbayar dikurangi refund, bukan dari cart.

## Folder utama

```text
starsuperscare-deno-neon-blueprint/
├── docs/00-overview/
├── apps/
│   ├── storefront/
│   ├── auth/
│   ├── dashboard/
│   ├── admin/
│   ├── api/
│   ├── worker/
│   └── tracking/
├── packages/
│   ├── database/
│   ├── auth/
│   ├── ui/
│   ├── email/
│   ├── contracts/
│   └── config/
├── infrastructure/
├── quality/
└── references/
```
