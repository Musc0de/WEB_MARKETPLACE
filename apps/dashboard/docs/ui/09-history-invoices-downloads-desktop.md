# History, Invoices, dan Downloads — Desktop

## Tujuan

Mencari transaksi lama, mengunduh invoice, dan mengakses entitlement digital.

## Route

`/history`, `/invoices`, `/downloads`

## Komposisi

History: summary totals + filters + pagination default 5. Invoices: searchable table with
status/date/download. Downloads: entitlement list with license/status/expiry/download action.

## Komponen utama

History summary, transaction table, pagination, invoice preview/download, digital entitlement
table/cards.

## Interaksi dan validasi

Date uses id-ID/Asia-Jakarta. Invoice download authenticated or signed short-lived. Digital download
checks entitlement each time. Buy again uses current price/stock.

## State wajib

No history, no filtered result, invoice generating/unavailable, download expired/limit reached.

## Gooey Toast

Invoice generation/download promise; download ready success; entitlement error inline + toast.

## Accessibility

Table headers, download filename meaningful, progress announced, filters labeled.

## Proposed source map

```text
apps/dashboard/src/features/history/
apps/dashboard/src/features/invoices/
apps/dashboard/src/features/downloads/
```

## Acceptance criteria

- Layout tidak overflow pada viewport target.
- Semua action mempunyai loading, success, error, dan disabled/guard state yang sesuai.
- Deep link dan browser refresh mempertahankan route.
- Keyboard, focus, screen-reader label, dan reduced-motion telah diuji.
- Tidak ada business rule yang dihitung hanya dari UI.
