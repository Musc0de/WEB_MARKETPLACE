# DAY 36 REPORT: Dashboard Shell, Route Guards, Navigation, dan Home Summary

**Tanggal:** 13 Juli 2026

## 1. Ringkasan Tugas
Pada Day 36, fokus utama adalah membangun aplikasi `apps/dashboard` yang akan menjadi pusat kontrol personal bagi pengguna (User Panel). Fitur-fitur yang dikerjakan mencakup inisialisasi arsitektur Dashboard, penanganan sesi pengguna, implementasi sistem navigasi yang responsif, serta penyediaan Ringkasan Akun di halaman *Home*.

## 2. Pekerjaan yang Diselesaikan

1.  **Dashboard API Client & Protected Route Guards:**
    - Membuat `apps/dashboard/src/lib/api.ts` yang menginisiasi Hono RPC Client ke `api.starsuperscare.net/v1` dengan `credentials: 'include'` agar sesi selalu tersambung.
    - Membuat `useSession.ts` hook untuk mengambil data profil session.
    - Membuat wrapper `<ProtectedRoute>` yang mengecek keabsahan session, menampilkan indikator *loading*, dan otomatis mengalihkan pengguna ke halaman login di *auth app* (disertai `return_to`) jika belum login.
    - Mengintegrasikan `<ProtectedRoute>` pada `DashboardLayout.tsx` dan `App.tsx`.

2.  **Layout & Navigation Architecture:**
    - Membuat `Sidebar.tsx` untuk navigasi *desktop* dengan rute ke Ringkasan, Pesanan, Riwayat Pembelian, dll. Tautan 'Keranjang' diarahkan ke *storefront* eksternal.
    - Membuat `MobileNav.tsx` untuk navigasi dasar di bagian bawah layar khusus tampilan seluler.

3.  **Home Summary API & UI:**
    - Mengimplementasikan *endpoint backend* baru di `apps/api/src/modules/dashboard/home.ts` (`GET /v1/dashboard/home`) yang dilindungi middleware otentikasi.
    - Mengembalikan data analitik seperti:
      - Jumlah Pesanan Aktif
      - Total Nilai Pembelian Keseluruhan (IDR)
      - Jumlah Notifikasi yang Belum Dibaca
      - Indikator Tagihan yang Belum Dibayar
      - Daftar 3 pesanan terbaru
    - Mendaftarkan rute dashboard ini di `app.ts` Hono.
    - Menambahkan antarmuka UI komponen `DashboardHome.tsx` pada aplikasi dashboard yang menampilkan ringkasan-ringkasan ini menggunakan `lucide-react` dan `@starsuperscare/ui`.

4.  **Tests & Quality Assurance:**
    - Menambahkan `dashboard.test.ts` untuk memverifikasi proteksi *authorization* dari `v1/dashboard/home`.
    - Memverifikasi keberhasilan *build* frontend dashboard.

## 3. Catatan Implementasi & Pemblokir
- *Authentication Middleware:* Saat mengintegrasikan *endpoint backend* dashboard, diidentifikasi bahwa *authMiddleware* tidak mengekspor `requireAuth` seperti yang sempat diduga. Middleware yang dikonfigurasi bernama `authMiddleware` dan sesi ditambahkan ke _Context_ `c.set('user', userRecord)`. Modifikasi dilakukan dengan cepat agar sesuai dengan konvensi Hono.
- *Testing:* Pengujian API membutuhkan `user` di basis data; ditangani dengan Drizzle ORM *insert*.

## 4. Langkah Selanjutnya (Day 37)
Fokus berikutnya (Day-37) akan bergeser ke **Address Management & Notification Settings**, atau jika playbook menentukan lain, maka mengikuti urutan hari ke-37 untuk fitur Dashboard.

**Status:** SELESAI ✅
