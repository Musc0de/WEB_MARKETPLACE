# DAY-18 REPORT: Admin Shell & Catalog UI

## Overview

Implementasi UI Admin untuk manajemen katalog dan aset telah selesai. Hari ini berfokus pada
melengkapi bagian _frontend_ dari _Admin Shell_ dan integrasinya dengan Hono RPC API yang telah
dibuat.

## Fitur Utama yang Diselesaikan

1. **Admin Layout & Navigation:** `AdminLayout.tsx` sebagai _shell_ navigasi menu admin dengan
   proteksi routing `AuthGuard`.
2. **Catalog Management (Products):**
   - **`ProductsList.tsx`**: Daftar produk dengan status dan tipe produk.
   - **`ProductForm.tsx`**: Form pembuatan dan pengeditan produk dengan _Unsaved-change Guard_.
     Terintegrasi dengan Zod Validation di client. Terdapat logic beda untuk produk digital/fisik.
3. **Variants & Prices:**
   - **`VariantsForm.tsx`**: Mengelola varian SKU dan harga. Ditampilkan di halaman edit produk jika
     produk sudah berhasil dibuat.
4. **Asset/Image Uploader:**
   - **`ImageUploader.tsx`**: Implementasi _Presigned Upload Flow_ yang mengunggah file langsung ke
     _storage_ menggunakan adapter `LocalStorageAdapter` untuk pengembangan lokal.
5. **Transient Feedback:**
   - Menambahkan package `goey-toast` pada `deno.jsonc`.
   - Menggunakan `goeyToast` untuk memberi _feedback_ sukses/gagal di UI admin.

## Kualitas dan Pengujian

- Memperbaiki peringatan linter (`deno lint`) pada codebase secara keseluruhan, serta menyesuaikan
  tipe data yang terlewat.
- Melakukan verifikasi _build_ untuk _frontend admin_ dengan Vite
  (`deno task --cwd apps/admin build`). Build telah berhasil tanpa masalah _dependency_.
- Membuat struktur basic file testing frontend (`ProductForm.test.tsx`).
- Menjalankan perintah `deno task quality` dan `deno fmt` untuk memastikan semua kode berjalan
  bersih.

## Tantangan & Resolusi

- **Drizzle Deno LSP Error:** Drizzle _types_ sering _conflicting_ dengan
  `explicit-module-boundary-types` pada Deno LSP, diselesaikan dengan menggunakan ignore tags dan
  modifikasi pada aturan linter di `deno.jsonc`.
- **Ecosystem Mismatch:** Vite tidak mendeteksi ekspor dari package workspace (`contracts`).
  Diselesaikan dengan menambahkan `resolve.alias` pada `apps/admin/vite.config.ts`.
- **UI Components:** Karena package `@starsuperscare/ui` belum mengekspor komponen `Input` dan
  `Select`, kami menggunakan native html tag `<input>` dan `<select>` yang kompatibel, namun bisa
  di-_upgrade_ kemudian hari ke _custom component_ jika dibutuhkan.

## Langkah Berikutnya

1. Mengintegrasikan adapter S3 (_Cloudflare R2_ atau _AWS S3_) saat sistem akan di-_deploy_ ke
   _production_.
2. Memperkaya _Dashboard Admin_ dengan metrik analitik.
3. Melanjutkan ke playbook untuk **Day-19**.
