# Day 19: Inventory Service & Admin Stock UI

## Ringkasan

Hari ini, fokus utama adalah membangun fondasi manajemen inventaris (Inventory Management) yang
handal dengan dukungan _Optimistic Concurrency Control_ serta merancang antarmuka Admin (UI) untuk
melakukan penyesuaian stok secara manual dan _real-time_.

## Perubahan File Utama

1. **`packages/database/src/db.ts`**: Mengganti driver koneksi database dari `neon-http` ke
   `neon-serverless` yang didukung dengan Connection Pool. Hal ini krusial untuk mengaktifkan
   kapabilitas transaksi ACID murni (`db.transaction`) di Drizzle ORM yang sebelumnya tidak didukung
   pada versi HTTP.
2. **`packages/contracts/src/inventory.ts`**: Menambahkan _schema_ validasi Zod untuk struktur data
   Inventory seperti _Warehouse_, _InventoryLevel_, _InventoryMovement_, dan
   _InventoryAdjustmentRequest_. Schema ini kemudian diekspor melalui `packages/contracts/index.ts`.
3. **`apps/api/src/modules/inventory/inventory.service.ts`**: Implementasi core logic layanan
   inventaris. Mencakup metode perlindungan _race-condition_ yang ketat menggunakan kolom `version`
   (Optimistic Locking) pada saat menambah atau mengurangi stok (_adjustStock_).
4. **`apps/api/src/modules/admin/inventory/admin-inventory.ts`**: Router API baru yang diproteksi
   menggunakan `authMiddleware` dan `requirePermission('catalog.write' / 'catalog.read')` untuk
   mengekspos endpoint manajemen inventaris ke portal Admin.
5. **`apps/admin/src/features/inventory/InventoryList.tsx` & `InventoryAdjustModal.tsx`**: Komponen
   antarmuka pengguna untuk Admin Dashboard yang menampilkan stok berdasarkan _Variant SKU_ dan
   menyediakan formulir modal untuk mengubah nilai stok dan mencatat alasan pengubahan.

## Keputusan Arsitektur

- **Peralihan ke Neon Serverless Pool**: Mengingat operasi inventaris memerlukan modifikasi
  multi-tabel yang harus 100% atomik (memperbarui _InventoryLevels_ dan mencatat
  _InventoryMovements_), kita membutuhkan fitur interaktif transaksi. Oleh karena itu, kita
  memigrasi database adapter ke `neon-serverless` (Pool/WebSocket) yang mendukung interaktif Drizzle
  `.transaction()`.
- **Pencegahan Race Condition (Optimistic Locking)**: Semua operasi perubahan nilai stok menyertakan
  pengecekan versi baris (_row versioning_). Jika sistem mendeteksi ada perubahan bersamaan
  (misalnya 2 admin melakukan _update_ di milidetik yang sama), transaksi kedua akan dibatalkan,
  menjamin tidak ada _"lost updates"_.

## Verifikasi dan Pengujian

- **Unit Testing Concurrency**: Implementasi _test suite_ yang menyimulasikan race condition pada
  saat pengubahan stok. Test tersebut membuktikan bahwa _Optimistic Locking_ secara akurat melempar
  error _"Concurrent modification detected"_ jika versi rekaman tidak valid.
- **Perbaikan Autentikasi dan Role Permission**: Masalah 401 Unauthorized berhasil diatasi dengan
  menambahkan `authMiddleware` pada root _inventory router_ dan memperbaiki konvensi _permission
  scoping_ menjadi `catalog.read` dan `catalog.write`.
- **Integrasi UI**: _Inventory Dashboard_ dan modal penyuntingan berhasil dirender, menangkap
  respons JSON yang sukses dikirim melalui jaringan rpc _hono/client_.

## Handoff untuk Pekerjaan Selanjutnya

Modul inventaris tahap pertama telah rampung. Semua penyesuaian stok dicatat dalam
_inventory_movements_ dengan _history_ yang rapi. Pada iterasi (atau hari) selanjutnya, kita dapat
mengimplementasikan fitur **Reservasi Inventaris (Inventory Reservation)** yang sangat berguna pada
sistem _checkout keranjang belanja_ (mengamankan stok untuk sementara waktu sebelum pembayaran
divalidasi).
