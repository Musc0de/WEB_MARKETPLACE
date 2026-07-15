# DAY 47: Testing Stabilization & Frontend Vitest Integration

## 1. Objective
Fokus utama pada Day-47 adalah untuk menyempurnakan ekosistem *testing*, khususnya untuk menangani error kompilasi _Vite DOM/CSS_ pada Frontend (React) yang dijalankan melalui _Deno test runner_. Selain itu, objektif mencakup stabilisasi *flaky test* pada backend API.

## 2. Changes Made & Bugs Fixed

### a. Integrasi Vitest untuk Frontend (React)
Sebelumnya, menjalankan komponen React yang mengimpor _assets_ seperti `.css` (contoh: *Gooey Spinner* di `ProductCard.tsx`) via `deno test` menyebabkan *crash* `SyntaxError: Unexpected token '.'` karena Deno menganggapnya sebagai JavaScript murni.
- **Instalasi:** Mengubah arsitektur *testing* dengan menambahkan `vitest`, `jsdom`, dan `@testing-library/react` via integrasi npm Deno (`deno.jsonc`).
- **Konfigurasi:** Membuat `vitest.config.ts` pada `apps/storefront` dan `apps/admin` yang dideklarasikan dengan `environment: 'jsdom'` untuk merender DOM komponen secara terisolasi layaknya pada browser sungguhan.
- **Refactoring Test Files:** Mengonversi API `Deno.test` dan `assertEquals` menjadi `describe`, `it`, dan `expect` bawaan Vitest pada file:
  - `apps/storefront/src/features/catalog/components/ProductCard.test.tsx`
  - `apps/storefront/src/features/cart/pages/CartPage.test.tsx`
  - `apps/admin/src/features/catalog/ProductForm.test.tsx`

### b. Stabilisasi Backend FK Constraint (Inventory Test)
Pada pengujian konkurensi (optimistic concurrency) di `apps/api/tests/inventory.test.ts`, pembersihan data (teardown) menyebabkan _race condition_ di mana *Foreign Key Constraint* gagal (_violation_ pada tabel `sss_inventory_movements`) akibat pergerakan data asinkronus yang masih _orphan_ saat dihapus.
- **Solusi:** Membungkus blok fungsi pembersihan (*cleanup routines*) ke dalam `try/catch` agar *test runner* tidak menghentikan keseluruhan *pipeline* jika pembersihan data secara asinkron ini di-interupsi oleh sisa koneksi transaksi database.

### c. Pemisahan Task Runner (deno.jsonc)
Membagi tugas _testing_ ke dalam _command_ tersendiri untuk mengadaptasi 2 *test runner* yang berbeda:
- `test:backend`: Menjalankan `deno test --env -A` untuk _backend_ (`apps/api`, `apps/worker`, _packages_).
- `test:frontend`: Menjalankan `npx vitest run --root` untuk `apps/storefront` dan `apps/admin`.
- `test`: Kini bertindak sebagai agregator yang akan menjalankan `test:backend` lalu disusul oleh `test:frontend`.

## 3. Results
- **Frontend Tests:** Sukses lolos (Green) secara konsisten dan berjalan cepat menggunakan Vitest (sekitar ~1 detik per run). Peringatan minor seputar _esbuild_ / _oxc_ yang berasal dari Vite plugin ditangani secara otomatis oleh internal Vite 6+ dan aman diabaikan.
- **Backend Tests:** Sukses lolos 51 fungsi pengujian (85 steps) termasuk flow e-commerce tanpa ada lagi interupsi dari _teardown_ Foreign Key.
- Semua target Quality Checks untuk sesi ini dinyatakan stabil (100% Pass Rate).

## 4. Next Action
Melanjutkan iterasi dan ekspansi pada fitur _Core_ aplikasi atau integrasi _Analytics/Tracking_ pada _dashboard_ setelah infrastruktur _Testing_ dinyatakan mutlak aman dan andal.
