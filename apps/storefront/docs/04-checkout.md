# Checkout

## URL dan langkah

```text
/checkout/address
/checkout/shipping
/checkout/payment
/checkout/review
/checkout/success
/checkout/failed
```

## Langkah 1 — Address

- Physical item wajib alamat pengiriman.
- Digital-only cart melewati shipping address kecuali data billing diperlukan.
- Guest memasukkan nama dan email untuk invoice/aktivasi akun.

## Langkah 2 — Shipping

- Tampilkan service, estimasi, dan biaya.
- Quote memiliki expiry.
- Mixed cart hanya menghitung shipping untuk physical items.

## Langkah 3 — Payment

- Aplikasi hanya menyimpan provider reference/token.
- Jangan menyimpan nomor kartu, CVV, atau raw payment credentials.
- Buat payment attempt dengan idempotency key.

## Langkah 4 — Review

- Tampilkan snapshot item, harga, diskon, shipping, tax, total, email, dan alamat.
- Checkbox syarat dan kebijakan refund.
- Tombol `Bayar Sekarang` harus mencegah double submit.

## Langkah 5 — Result

Redirect browser bukan bukti final payment. Status akhir ditetapkan dari webhook provider yang
diverifikasi.

## Transaction minimum

Saat membuat order:

1. Lock cart.
2. Revalidate price, voucher, dan stock.
3. Reserve stock fisik.
4. Create order + order_items snapshot.
5. Create payment attempt.
6. Create outbox event.
7. Commit.

## Idempotency

- Header `Idempotency-Key` untuk submit checkout.
- Unique provider event ID untuk webhook.
- Repeat request harus mengembalikan order yang sama, bukan membuat duplikat.
