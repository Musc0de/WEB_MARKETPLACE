# Day 42 Report - Support Center Infrastructure

## Tanggal
15 Juli 2026

## Fitur yang Diselesaikan

Pada Day-42, kami telah berhasil membangun infrastruktur dan implementasi fitur **Support Center** untuk Customer dan Admin Dashboard, meliputi FAQ, Tiket Bantuan, Pesan, dan sistem unggah Lampiran.

### 1. Database & Skema
- **Tabel Baru**:
  - `faqs`: Menyimpan daftar Frequently Asked Questions (FAQ) beserta kategori dan urutannya.
- **Update Tabel**:
  - `supportTickets`: Menambahkan kolom `category` (general, order, product, payment) dan `orderId` (untuk menghubungkan tiket langsung dengan pesanan tertentu).
  - Skema diupdate di `packages/database/src/schema/aftercare.ts`.
- **Migration**: Migrasi berhasil dijalankan menggunakan `drizzle-kit push` (menggunakan versi yang kompatibel `drizzle-kit@0.22.8`).

### 2. Backend (API)
- **User Support API (`/api/v1/support`)**:
  - Menangani pengambilan FAQ publik.
  - CRUD operasi untuk tiket pengguna (membuat tiket, melihat detail tiket).
  - Endpoint pesan balasan (`messages`) dan pengunggahan lampiran menggunakan provider storage.
- **Admin Support API (`/api/v1/admin/support`)**:
  - Endpoint manajemen antrian tiket dengan filtering status.
  - Update status tiket dan pesan internal antar tim support (`isInternal`).

### 3. Frontend Customer Dashboard (`apps/dashboard`)
- **SupportPage**: Menampilkan daftar FAQ dalam tab, dan daftar "Tiket Saya" di tab terpisah.
- **SupportTicketModal**: Formulir bagi pengguna untuk membuat tiket baru, memilih kategori, dan (opsional) menghubungkan UUID pesanan.
- **TicketDetailPage**: Halaman thread pesan (chat-like) untuk berdiskusi dengan tim support dan mengirim lampiran.
- *Route dan navigasi* telah disesuaikan dan diintegrasikan dalam Sidebar.

### 4. Frontend Admin Dashboard (`apps/admin`)
- **SupportQueueList**: Tabel antrian tiket support untuk Admin dengan filter status (Semua, Open, In Progress, Resolved, Closed).
- **AdminTicketDetailPage**:
  - Tampilan thread dari kacamata tim support.
  - Fitur *"Catatan Internal"* (pesan yang hanya bisa dilihat oleh Admin, disorot dengan warna kuning peringatan).
  - Mengelola status tiket.

### 5. Standardisasi Code (Lint & Formatting)
- Telah dijalankan `deno fmt` dan `deno task check` untuk memastikan *type safety* pada skema Zod (terutama properti opsional `attachments` pada `SupportMessage`) serta menghapus import variabel React & UI yang tak digunakan.

## Kesimpulan
Infrastruktur backend dan antarmuka untuk Pusat Bantuan telah sepenuhnya diimplementasikan dan bebas dari error kompilasi/linting TypeScript, menjadikan layanan bantuan siap digunakan oleh pelanggan.
