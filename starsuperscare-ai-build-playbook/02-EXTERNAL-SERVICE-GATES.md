# External Service Gates

Coding AI dapat membangun adapter dan fake, tetapi layanan berikut memerlukan tindakan
manusia/credential. Jangan memasukkan secret ke prompt, chat, commit, screenshot, atau file
Markdown.

## Day 06 — Neon

Dibutuhkan:

- Project Neon.
- Branch/database `development`, `staging`, `production`.
- `DATABASE_URL` pooled untuk API/worker runtime.
- `DATABASE_URL_DIRECT` direct untuk migration.

Verifikasi: connection smoke test, migration development, dan query `select 1`.

## Day 18/32 — Object storage

Dibutuhkan S3-compatible storage atau provider setara untuk product images, bukti retur,
attachments, digital files, dan private invoices.

Env generik:

```text
STORAGE_ENDPOINT
STORAGE_REGION
STORAGE_BUCKET_PUBLIC
STORAGE_BUCKET_PRIVATE
STORAGE_ACCESS_KEY_ID
STORAGE_SECRET_ACCESS_KEY
STORAGE_PUBLIC_BASE_URL
```

Gunakan presigned upload/download. Secret hanya pada API/worker.

## Day 29/45 — Shipping/courier

Sebelum provider dipilih, gunakan `MockShippingProvider` yang deterministic. Untuk provider nyata
dibutuhkan base URL, client/key, webhook secret, dan mapping status.

## Day 30 — Payment gateway

Sebelum provider dipilih, gunakan `MockPaymentProvider`. Integrasi production membutuhkan:

```text
PAYMENT_PROVIDER
PAYMENT_PUBLIC_KEY
PAYMENT_SECRET_KEY
PAYMENT_WEBHOOK_SECRET
PAYMENT_RETURN_BASE_URL
```

Nama env spesifik mengikuti provider. Webhook, bukan redirect browser, adalah sumber status final.

## Day 32 — Transactional email

Dibutuhkan verified sender/domain dan API key. Env generik:

```text
EMAIL_PROVIDER
EMAIL_API_KEY
EMAIL_FROM_NAME
EMAIL_FROM_ADDRESS
EMAIL_REPLY_TO
```

Test/dev memakai fake inbox atau provider sandbox; jangan mengklaim delivery nyata tanpa provider
response.

## Day 49 — Deployment dan DNS

Dibutuhkan akses deployment platform dan DNS untuk host yang sudah ada pada blueprint. `apps/worker`
tidak mendapat DNS publik. Pastikan staging dan production memakai secret, DB branch, provider mode,
bucket, dan webhook yang terpisah.
