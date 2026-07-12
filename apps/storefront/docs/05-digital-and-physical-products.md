# Produk Digital dan Fisik

## Product type

```text
physical
 digital
service (opsional)
```

## Physical

- Memiliki berat, dimensi, stok gudang, shipping class, dan shipment.
- Stok dapat berstatus available, reserved, sold, returned, damaged.
- Fulfillment dimulai setelah payment dan fraud/risk check selesai.

## Digital

- Memiliki asset version, file key, checksum, license type, download limit, dan expiry.
- Setelah payment sukses, buat `digital_entitlement` per order item.
- Client mengunduh dari `dashboard.starsuperscare.net/downloads` menggunakan signed URL singkat.
- Jangan menampilkan object-storage key langsung.
- Refund dapat menonaktifkan entitlement sesuai kebijakan.

## Mixed cart

Satu order dapat berisi physical dan digital item:

- Payment dan invoice tetap satu.
- Physical item menghasilkan shipment.
- Digital item menghasilkan entitlement.
- Status order agregat harus membedakan payment, fulfillment, shipment, dan digital delivery.

## Status yang disarankan

```text
payment: pending | paid | failed | refunded | partially_refunded
order: pending | processing | completed | cancelled
physical_fulfillment: unfulfilled | packed | shipped | delivered | returned
digital_fulfillment: locked | available | downloaded | revoked
```
