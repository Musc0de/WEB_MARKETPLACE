# Public Tracking App

**Domain:** `tracking.starsuperscare.net`

## Tujuan

Memberikan status pengiriman terbatas tanpa membuka dashboard penuh.

## Route

```text
/{tracking_token}
```

Gunakan token opaque dengan entropy tinggi, bukan order number atau shipment ID sebagai satu-satunya authorization.

## Informasi yang boleh tampil

- Nomor tracking yang dimasking bila perlu.
- Kurir dan service.
- Status dan timeline pengiriman.
- Estimasi tiba.
- Waktu update terakhir.

Jangan tampilkan full email, telepon, alamat, payment, invoice, atau data order lain.

## API

```text
GET /v1/public/tracking/{tracking_token}
```

Endpoint diberi rate limit, expiry/revocation policy, dan tidak boleh mengungkap apakah order privat tertentu ada melalui identifier yang mudah ditebak.
