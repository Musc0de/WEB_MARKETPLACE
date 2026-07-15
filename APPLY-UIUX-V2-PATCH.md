# Cara Menerapkan UI/UX V2 Patch

Patch ini hanya berisi dokumentasi UI/UX baru dan file dokumentasi lama yang perlu diganti. Patch tidak berisi source code aplikasi, migration, atau secret.

## Cara paling aman

1. Backup repository atau commit semua perubahan.
2. Ekstrak ZIP patch.
3. Buka folder `starsuperscare-ui-ux-v2-patch/`.
4. Copy **seluruh isi folder tersebut**, bukan folder pembungkusnya.
5. Paste ke root repository StarSuperScare.
6. Pilih `Replace/Overwrite` ketika nama file sama.
7. Pilih `Merge folders`; jangan memilih delete destination.
8. Periksa `git status` dan `git diff --stat`.

Contoh target:

```text
WEB-MARKETPLACE/
├── README.md
├── UI-UX-START-HERE.md
├── docs/
├── apps/
├── packages/
└── quality/
```

## File yang aman diganti

Lihat `FILES-TO-REPLACE.md`. Semua file dalam patch adalah Markdown dokumentasi. Tidak ada file `.ts`, `.tsx`, `.sql`, `.env`, atau konfigurasi runtime yang ditimpa.

## Bila memakai ZIP full

ZIP full sudah berisi seluruh blueprint sistem dan UI/UX V2. Gunakan untuk repository dokumentasi baru atau sebagai referensi lengkap. Untuk repository kode yang sudah berjalan, lebih aman memakai ZIP patch.

## Setelah copy

Baca:

1. `UI-UX-START-HERE.md`
2. `UI-UX-IMPLEMENTATION-ORDER.md`
3. `PATCH-MANIFEST.md`
4. `packages/ui/docs/08-code-file-map.md`

Kemudian implementasikan satu gate pada satu waktu.
