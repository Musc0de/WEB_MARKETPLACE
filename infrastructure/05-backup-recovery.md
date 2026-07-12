# Backup dan Recovery

## Data penting

- Identity dan session metadata.
- Product/catalog.
- Inventory ledger.
- Order/payment/invoice/refund.
- Digital entitlements.
- Outbox/audit.
- Object storage assets.

## Runbook

1. Dokumentasikan backup/PITR capability sesuai Neon plan.
2. Lakukan restore test berkala ke branch terpisah.
3. Verifikasi konsistensi order-payment-inventory setelah restore.
4. Object storage memakai versioning/lifecycle sesuai kebutuhan.
5. Simpan migration dan infrastructure config di version control.
6. Tetapkan RPO/RTO bisnis sebelum launch.

Backup yang tidak pernah diuji restore belum dianggap siap.
