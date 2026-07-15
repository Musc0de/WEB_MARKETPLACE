# History, Invoices, dan Downloads — Mobile

## Tujuan

Menampilkan transaksi dan file sebagai cards dengan action yang mudah dijangkau.

## Route

`/history`, `/invoices`, `/downloads`

## Komposisi

Summary cards compact; filter via sheet. History/invoice/download rows menjadi cards. Pagination
default 5 tetap jelas. Invoice action melalui buttons/overflow menu. Download progress tampil
inline.

## Komponen utama

Mobile transaction card, filter sheet, pagination, invoice card, entitlement card.

## Interaksi dan validasi

Do not hide status/total in overflow. Download action disabled with reason. Date filters use
mobile-friendly picker.

## State wajib

Empty, generating, download pending, expired, offline.

## Gooey Toast

Bottom-center. File download success/action optional Open; error includes retry.

## Accessibility

Card headings, filename/status readable, touch targets, no horizontal table dependency.

## Proposed source map

```text
apps/dashboard/src/features/history/pages/mobile-history-page.tsx
apps/dashboard/src/features/invoices/pages/mobile-invoices-page.tsx
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
