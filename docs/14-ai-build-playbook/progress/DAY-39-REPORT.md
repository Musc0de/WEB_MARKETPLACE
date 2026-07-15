# Laporan Day 39: History, Invoices, dan Digital Downloads

## Ringkasan Eksekutif

Implementasi antarmuka dan backend untuk fitur **Riwayat Pesanan (History)**, **Pusat Faktur (Invoices)**, dan **Unduhan Digital (Digital Downloads)** bagi pengguna di dalam aplikasi web Marketplace (`apps/dashboard` dan `apps/api`) berhasil dituntaskan pada Day 39.

## Capaian Utama

### 1. Sistem History (Riwayat Transaksi)

- **API**: Menambahkan `apps/api/src/modules/history` (mounted di `GET /v1/history`) yang mem-fetch pesanan yang diagregasi dengan pagination dan ringkasan metrik.
- **UI**: Mengembangkan `HistoryPage.tsx` yang menampilkan informasi agregat (`Total Transaksi`, `Total Nominal`, `Selesai`, `Refund`) bersama dengan daftar riwayat transaksi pengguna.
- **Filter & Timezone**: Menyertakan parameter filter untuk _Status_, _Tahun_, dan _Tanggal_, dan menyesuaikan format waktu UI dalam `id-ID Asia/Jakarta`.

### 2. Pusat Tagihan & Invoice

- **API**: Membuat `apps/api/src/modules/invoices` dengan dua end-points: `GET /v1/invoices` dan `GET /v1/invoices/:id/download`.
- **Sistem Download**: Mengimplementasikan _mock stream/direct fetch_ file invoice dari `pdfObjectKey` sambil memastikan cek kepemilikan faktur tersebut lewat otorisasi pengguna (`userId`) yang dikaitkan ke tabel order.
- **UI**: Membangun `InvoicesPage.tsx` untuk menampilkan tagihan lengkap dengan tombol "Unduh PDF" yang mensimulasikan fetch blob aman dan prompt download browser.

### 3. Digital Downloads (Entitlements)

- **API**: Menambahkan `apps/api/src/modules/downloads` yang men-serve daftar _digital entitlements_ (`GET /v1/downloads`) dan memfasilitasi stream file-nya (`GET /v1/downloads/:id/stream`).
- **Enforcement Aturan**: Endpoint API memeriksa masa berlaku (_expiresAt_), status, dan kuota limit (jika `downloadLimit` ada) sebelum mentransmisikan _asset/file_. Counter unduhan di-_increment_ setelah validasi berhasil.
- **UI**: Menambahkan `DownloadsPage.tsx` untuk menampilkan daftar pembelian digital pengguna berikut statusnya (batas unduh dan kedaluwarsa). Jika tidak lagi valid, tombol akan di-disable.

### 4. Contracts & Quality Control

- **Zod Contracts**: Menciptakan schema Zod ketat untuk interaksi UI & Backend (`history.ts`, `downloads.ts`, penyesuaian `invoice.ts`).
- **Testing**: Menambahkan file tes komprehensif (`history.test.ts`, `invoices.test.ts`, `downloads.test.ts`) untuk memverifikasi fitur IDOR, paginasi, dan kepemilikan.
- **Deno Checks**: Memastikan program lulus dari test linting, format, dan type checker.

## Langkah Selanjutnya (Next Steps)

Untuk milestone ke depannya, implementasi tagihan sesungguhnya melalui integrasi S3 Bucket atau CDN provider untuk `pdfObjectKey` dapat dipersiapkan. Untuk saat ini, infrastruktur dan API telah diamankan lewat pola otorisasi, check kepemilikan, dan _entitlement guard_ sesuai batasan spesifikasi Day 39.
