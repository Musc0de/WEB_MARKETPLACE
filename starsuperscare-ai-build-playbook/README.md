# StarSuperScare — AI Build Playbook

Playbook ini mengubah blueprint menjadi **50 hari kerja, 8 jam per hari**, untuk satu developer yang
dibantu coding AI. Empat blok kerja harian memakai zona waktu Asia/Jakarta:

- 08:00–10:00
- 10:15–12:15
- 13:15–15:15
- 15:30–17:30

Targetnya bukan menjanjikan semua pekerjaan pasti selesai persis dalam 50 hari. Ini adalah urutan
dependency yang aman. Bila satu acceptance gate belum lulus, lanjutkan hari tersebut sebelum masuk
hari berikutnya.

## Arsitektur yang tidak boleh diubah

- `starsuperscare.net`: landing dan halaman informasi publik.
- `shop.starsuperscare.net`: products, product detail, category/search, cart, checkout, dan guest
  wishlist.
- `auth.starsuperscare.net`: login, signup, verifikasi, aktivasi, forgot/reset, dan logout.
- `dashboard.starsuperscare.net`: area client setelah login.
- `api.starsuperscare.net/v1`: REST API dan SSE.
- `admin.starsuperscare.net`: operasi admin.
- `tracking.starsuperscare.net`: tracking publik dengan token opaque.
- `assets.starsuperscare.net`: target aset publik/CDN bila dipakai.
- `apps/worker`: proses internal; tidak mempunyai subdomain publik.

Cart dan checkout tidak dipindahkan ke dashboard. Database hanya boleh diakses oleh `apps/api` dan
`apps/worker` melalui `packages/database`.

## Cara memakai

1. Buka repository di coding agent yang dapat membaca dan mengedit file serta menjalankan terminal.
2. Tempel `00-MASTER-PROMPT.md` satu kali pada awal sesi/project instruction.
3. Kerjakan `prompts/DAY-01.md`, lalu lanjut berurutan.
4. Jangan melompati Gate Day 05, 10, 15, 20, 25, 30, 35, 40, 45, dan 50.
5. Setelah AI selesai, periksa diff dan hasil test sebelum commit.
6. Laporan AI disimpan di folder `progress/`; jangan percaya klaim tanpa output command.

## File penting

- `00-MASTER-PROMPT.md`: aturan tetap untuk coding agent.
- `01-DAILY-OPERATING-PROCEDURE.md`: ritme kerja dan review manusia.
- `02-EXTERNAL-SERVICE-GATES.md`: credential yang harus disediakan pada waktu yang tepat.
- `03-DEFINITION-OF-DONE.md`: syarat sebuah hari/phase dianggap selesai.
- `04-50-DAY-SUMMARY.md`: ringkasan seluruh roadmap.
- `weeks/`: jadwal per minggu dengan blok per jam.
- `prompts/`: 50 prompt siap-tempel.
- `templates/`: format laporan, blocker, dan ADR.

## Checkpoint utama

| Hari | Gate        | Hasil minimum                                                     |
| ---: | ----------- | ----------------------------------------------------------------- |
|    5 | Foundation  | Workspace, app scaffold, shared packages, CI                      |
|   10 | Database    | Migration dari DB kosong dan seed berhasil                        |
|   15 | Auth        | Signup/verify/login/session/recovery/activation bekerja           |
|   20 | Catalog     | Public catalog dan admin catalog/inventory bekerja                |
|   25 | Storefront  | Product list/detail/search/wishlist selesai                       |
|   30 | Checkout    | Guest/user cart, order, reservation, payment mock/webhook selesai |
|   35 | Integration | Payment → invoice/email/account/notification teruji               |
|   40 | Dashboard   | Lifecycle client dapat dilihat dan dikelola                       |
|   45 | Operations  | Return/support/admin/tracking selesai                             |
|   50 | Launch      | Test, security, staging, production, handover                     |
