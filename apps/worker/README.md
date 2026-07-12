# Worker App

## Job utama

- Process `outbox_events`.
- Kirim email invoice/activation/reset/shipping.
- Generate invoice PDF.
- Create persistent notifications.
- Publish SSE delivery event.
- Release expired stock reservations.
- Expire sessions, reset tokens, activation tokens, and guest carts.
- Recompute product statistics bila diperlukan.

## Queue MVP

Gunakan PostgreSQL table dengan status:

```text
pending | processing | succeeded | failed | dead
```

Worker mengambil batch menggunakan transaction dan `FOR UPDATE SKIP LOCKED`, menetapkan
lease/attempt, lalu memproses di luar lock panjang.

## Retry

- Exponential backoff + jitter.
- Maximum attempts per job type.
- Permanent failure masuk dead-letter state.
- Admin dapat melihat dan retry job setelah penyebab diperbaiki.

## Idempotency

Setiap job memiliki `dedupe_key`; email/invoice/notifikasi tidak boleh terkirim ganda hanya karena
retry.
