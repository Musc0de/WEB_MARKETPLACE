# Returns dan Refunds

## URL

```text
/dashboard/returns
/dashboard/returns/{return_number}
/dashboard/refunds
```

## Alur return

1. Pilih order item yang eligible.
2. Pilih quantity dan alasan.
3. Isi keterangan.
4. Upload bukti ke object storage melalui signed upload.
5. Submit request.
6. Admin review.
7. Bila disetujui, tampilkan instruksi pengiriman balik atau langkah digital.
8. Setelah diterima/diterima sistem, proses refund.

## Data

- Return status dan timeline.
- Evidence metadata.
- Komunikasi client-admin.
- Refund amount dan provider reference.

## Produk digital

Kebijakan refund harus jelas. Bila refund finalized, entitlement dapat direvoke dan net sold
dikurangi sesuai aturan akuntansi sistem.

## Idempotency

Refund provider call dan webhook harus idempotent. Jangan mengubah sold hanya dari request return;
lakukan setelah refund finalized.
