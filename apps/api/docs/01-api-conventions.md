# API Conventions

## Versioning

Semua route publik dimulai `/v1`. Breaking change memerlukan versi baru atau kompatibilitas transisi.

## Identifier

Gunakan UUIDv7/ULID untuk internal ID dan nomor manusia-terbaca terpisah untuk order/invoice/ticket.

## Pagination

- Dashboard history default `page=1&per_page=5`.
- Product list dapat menggunakan `page/per_page` pada MVP.
- Tetapkan maksimum `per_page` untuk mencegah query berat.

## Errors

```json
{
  "data": null,
  "meta": { "request_id": "req_..." },
  "error": {
    "code": "CART_STOCK_INSUFFICIENT",
    "message": "Stok produk tidak mencukupi",
    "fields": { "quantity": "Maksimal 2" }
  }
}
```

## Idempotency

Wajib untuk checkout submit, payment create, refund create, webhook, dan job delivery.

## Authorization

Setiap query resource privat harus memeriksa ownership atau role di server. Menebak ID tidak boleh memberi akses.
