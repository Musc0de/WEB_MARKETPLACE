# Webhooks dan Idempotency

## Endpoint

```text
POST /v1/webhooks/payments/{provider}
POST /v1/webhooks/shipping/{provider}
POST /v1/webhooks/email/{provider}
```

## Urutan payment webhook

1. Baca raw body bila signature membutuhkannya.
2. Verifikasi signature/timestamp.
3. Parse event.
4. Insert `webhook_events` dengan unique provider event ID.
5. Bila duplicate, return sukses tanpa memproses ulang.
6. Lock payment/order.
7. Terapkan state transition yang valid.
8. Update inventory/sold/account/invoice sesuai event.
9. Insert outbox events dalam transaction yang sama.
10. Commit dan respond cepat.

## State transition

Jangan menerima transisi mundur yang tidak valid. Contoh: event `pending` yang terlambat tidak boleh
menimpa `paid`.

## Retry

Provider dapat mengirim ulang webhook. Handler harus aman dijalankan berkali-kali. Side effect email
dan invoice memakai dedupe key.
