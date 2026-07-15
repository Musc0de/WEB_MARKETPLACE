# Rollback Runbook

Dokumen ini memandu Anda dalam melakukan pembatalan (*rollback*) rilis ke versi stabil sebelumnya apabila ditemukan kesalahan atau *blocker* kritis di tahap Production/Staging setelah *deploy* dijalankan.

## 1. Frontend Rollback
Sebagian besar masalah UI atau logika klien harus diatasi dengan metode **Roll Forward** (membuat perbaikan dan _deploy_ rilis kecil baru) karena lebih aman dan cepat pada arsitektur _serverless_.

Jika Rollback harus dilakukan (misal karena *crash loop*), langkahnya:
1. Masuk ke Dashboard penyedia *hosting frontend* (misal: Cloudflare Pages / Vercel).
2. Di riwayat *Deployments*, pilih *Deployment* sukses sebelumnya.
3. Klik opsi **"Restore"** atau **"Promote to Production"**.
4. Verifikasi bahwa aplikasi versi stabil sebelumnya sudah kembali ditayangkan.

## 2. API & Worker Rollback (Deno Deploy)
Sama halnya dengan *frontend*, jika Deno API mengalami _crash loop_ atau kesalahan konfigurasi krusial:
1. Buka Deno Deploy Dashboard proyek Anda.
2. Navigasikan ke tab **Deployments**.
3. Temukan _commit_ spesifik yang stabil sebelum pembaruan ini, lalu klik ikon panah melingkar atau **"Rollback"**.
4. Tunggu beberapa detik, periksa endpoint `/health`.

## 3. Database Migration Rollback (Neon Postgres)
Sistem database StarSuperScare berprinsip untuk melakukan *migration forward*. Sangat tidak disarankan untuk melakukan manipulasi atau menghapus kolom/tabel yang aktif digunakan (*destructive migrations*).

### Skenario 1: Kerusakan Skema Database Minor (Forward Fix)
1. Perbaiki entitas Drizzle Schema secara lokal.
2. Hasilkan file migrasi baru `deno task generate`.
3. Dorong migrasi baru ke Staging/Production untuk menambal kerusakan.

### Skenario 2: Korupsi Data Fatal (Restore Snapshot)
Berkat Neon DB, arsitektur kita memiliki fitur _point-in-time recovery_ atau restorasi cabang.
1. Buka Neon Dashboard.
2. Cari cabang (Branch) database Anda (contoh: `main`).
3. Pilih fitur **"Restore"** dan pilih tanggal/waktu spesifik *sebelum* migrasi yang merusak tersebut terjadi.
4. Pastikan aplikasi langsung di-_restart_ agar kumpulan koneksi (_connection pool_) memuat ulang data dengan aman.

## Penanganan Pasca Rollback
1. Kirim notifikasi/pengumuman *incident* di Slack/Email tim (jika berdampak lebih dari 5 menit).
2. Laporkan detail *error* (dari _logger_) dalam file *Issue Tracker* (atau `RC-1.md`).
3. Selidiki akar masalah pada *branch* eksperimental (jangan menyentuh branch Staging/Main) sampai terselesaikan.
