# DAY 30 REPORT - Payment Gateway Integration

**Date:** 13 Juli 2026

## Ringkasan Eksekutif
Pada Day-30, kita telah menyelesaikan implementasi arsitektur **Payment Gateway** (menggunakan *SandboxPaymentProvider*) lengkap dengan sistem verifikasi webhook yang aman, menjaga *idempotency*, dan alur UI yang berorientasi pada status backend (bukan pada browser). 

## Fitur dan Perubahan Utama

### 1. Kontrak Payment (`packages/contracts`)
- Mendefinisikan schema untuk `PaymentIntentRequest` dan `WebhookPayload`.
- Memastikan schema di-export dari `packages/contracts/index.ts`.

### 2. Provider API & Intent (`apps/api/src/modules/payments`)
- **SandboxPaymentProvider:** Provider pembayaran tiruan (sandbox) yang berfungsi menghasilkan `providerTransactionId` secara deterministik untuk simulasi, lengkap dengan *HMAC-SHA256 signature generator* untuk webhook payload.
- **Endpoint POST `/v1/payments/intent`:** Endpoint yang dipanggil oleh frontend untuk mendapatkan token/clientSecret.

### 3. Webhook Listener (`apps/api/src/routes/v1/webhooks.ts`)
- **Endpoint POST `/v1/webhooks/payments`:**
  - **Verifikasi Signature:** Memvalidasi `X-Signature` di header request menggunakan secret key. Permintaan dengan signature invalid ditolak (`401 Unauthorized`).
  - **Idempotency:** Menyimpan `providerEventId` di tabel `sss_payment_events`. Menolak duplikasi secara aman tanpa error.
  - **Atomic Transaction:** 
    - Saat menerima `payment_success`, status `sss_orders` akan berubah menjadi `paid`.
    - Jika gagal, kita mengimplementasikan fallback status `failed`.

### 4. UI Storefront (`apps/storefront`)
- **`CheckoutPage.tsx`**: Setelah menekan "Bayar Sekarang", pengguna diarahkan ke `/payment/:orderId`.
- **`PaymentPage.tsx`**: Menampilkan UI pembayaran simulasi. Terdapat tombol untuk mencoba "Pembayaran Berhasil" dan "Pembayaran Gagal". Saat diklik, tombol tersebut menembak simulasi webhook.
- **`PaymentStatusPage.tsx`**: Menampilkan polling status dari backend setiap 2 detik selama 30 detik untuk memastikan kita hanya percaya pada state backend.

### 5. API Testing (`apps/api/tests/payments.test.ts`)
- Tes integrasi Deno dibuat untuk menguji alur `POST /v1/payments/intent` dan `POST /v1/webhooks/payments`.
- Menguji kasus gagal (invalid signature) dan idempotency duplikasi webhook.

## Catatan Arsitektur
- Sistem dirancang sedemikian rupa agar **browser/frontend bukanlah *source of truth* untuk validasi pembayaran**. Keberhasilan order diandalkan murni pada kedatangan webhook dari pihak ketiga yang lolos verifikasi kriptografis.
- Untuk mode Sandbox ini, kita menambahkan endpoint `/v1/payments/simulate` yang men-generate signature dari server dan men-trigger webhook loopback, karena frontend tidak boleh menyimpan webhook secret key.

## Langkah Berikutnya (Day-31)
- Refine sistem inventori agar `commit` dan `rollback` reservation barang terintegrasi penuh dengan webhook events.
- Implementasi sistem struk/invoice email saat order berhasil dibayar.

***
*Laporan ini digenerate secara otomatis pada akhir Day-30.*
