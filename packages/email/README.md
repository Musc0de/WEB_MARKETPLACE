# Email dan Invoice

## Email transaksional

- Verifikasi signup.
- Aktivasi akun hasil pembelian.
- Password reset.
- Payment sukses/gagal.
- Invoice.
- Shipment dan delivery.
- Return/refund.
- Security notification.

## Arsitektur

1. Business transaction membuat outbox event.
2. Worker membuat/render template.
3. Provider adapter mengirim email.
4. Simpan provider message ID dan delivery status.
5. Webhook email memperbarui delivered/bounced/complained.

## Invoice

- Invoice record dibuat idempotent berdasarkan order.
- PDF digenerate worker dan disimpan object storage.
- Email dapat melampirkan PDF kecil atau memberi signed download link.
- Dashboard selalu menjadi sumber akses invoice yang authenticated.

## Template variables

Gunakan typed contract. Escape user-provided values. Jangan memasukkan raw token ke log. Activation/reset link wajib HTTPS dan expiry jelas.

## Provider abstraction

Buat interface `EmailProvider` agar provider dapat diganti tanpa mengubah order/auth domain logic.
