# UI/UX V2 Patch Manifest

## Status cakupan

Paket UI/UX lama memang sudah menyebut auth, storefront, dashboard, admin, dan tracking, tetapi sebagian besar hanya berupa outline singkat. UI/UX V2 memperluasnya menjadi spesifikasi page-level untuk desktop dan mobile, lengkap dengan states, interaction, accessibility, Gooey Toast mapping, source map, dan acceptance criteria.

## Isi patch

- Total Markdown dalam patch: 141.
- Satu file `SHA256SUMS.txt` untuk verifikasi.
- Konten fungsional patch berupa Markdown; file tambahan hanya `SHA256SUMS.txt` untuk verifikasi.
- Tidak mengubah source code, database, API, route, domain, worker, payment, atau secret.

## Area lengkap

- Shared UI/UX foundation.
- Auth login/signup/activation/verification/recovery desktop dan mobile.
- Storefront marketplace desktop dan mobile.
- Dashboard client seluruh halaman desktop dan mobile.
- Admin desktop dan tablet/mobile fallback.
- Tracking desktop dan mobile.
- Shared `packages/ui` contract.
- UI QA, responsive, accessibility, Gooey Toast, dan visual regression.

## Cara copy

Baca `APPLY-UIUX-V2-PATCH.md` dan `FILES-TO-REPLACE.md`.
