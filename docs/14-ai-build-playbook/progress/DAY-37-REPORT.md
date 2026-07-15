# DAY 37: User Advanced Profile & Settings

## Tinjauan Singkat
Pada Day-37, kita telah mengimplementasikan kumpulan fitur _user management_ secara lengkap pada antarmuka pengguna `apps/dashboard` dan menyiapkan kumpulan *API endpoint* baru yang terisolasi di `apps/api/src/modules/me`.

## Detail Fitur yang Diimplementasikan

### 1. Backend REST API (`/v1/me/*`)
- **Profile Endpoint (`profile.ts`)**: Mampu membaca gabungan data pengguna `users` dan `userProfiles` serta memperbarui data _profil_ pengguna.
- **Security Endpoint (`security.ts`)**: Memfasilitasi penggantian _password_ secara aman menggunakan `verifyPassword` dan `hashPassword` dari modul utilitas *Auth* bawaan kita. Menyertakan endpoint untuk membaca `sessions` aktif dan `loginAttempts`, serta dapat melakukan *revoke* sesi tertentu atau mereset seluruh sesi selain sesi saat ini.
- **Addresses Endpoint (`addresses.ts`)**: Mendukung operasi CRUD (*Create, Read, Update, Delete*) lengkap untuk tabel `addresses`, dengan penanganan logika otomatis bagi pengaturan alamat "utama" (*isPrimaryShipping*, *isPrimaryBilling*).
- **Payment Methods Endpoint (`payment-methods.ts`)**: Mendukung penyimpanan metadata (_mock_) dompet digital, dengan mematuhi _best-practice_ untuk tidak menyimpan `PAN` asli, melainkan token penyedia layanan `providerToken`.

### 2. Frontend UI (`apps/dashboard`)
Kita telah menghubungkan _React Router_ di `App.tsx` ke berbagai halaman terpisah, serta menambahkan *icon* menu di `Sidebar.tsx` dan `MobileNav.tsx`:
- **Profil Saya (`/profile`)**: Formulir untuk mengatur nama, no telepon, zona waktu, dan *locale*.
- **Keamanan & Sesi (`/security`)**: UI ubah kata sandi beserta riwayat sesi aktif yang dapat dicabut, juga riwayat akses _login_.
- **Buku Alamat (`/addresses`)**: Menampilkan _grid_ kartu alamat, termasuk fungsionalitas tambah/edit yang kompleks dengan _checkbox primary_.
- **Metode Pembayaran (`/payments`)**: *Mock-up* untuk simulasi penambahan metode pembayaran tanpa integrasi Stripe/Midtrans yang sebenarnya.

## Hasil Validasi
Proyek saat ini telah melalui proses `deno fmt` dan `deno lint`, yang membersihkan `unused variable`. Kualitas lint dan build telah disiapkan sehingga semua UI bekerja mulus dengan `swr`.
