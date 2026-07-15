# Public Tracking UI Scope and Security

Tracking menggunakan opaque public token, bukan raw database id. UI tidak menampilkan data pribadi
lebih dari yang diperlukan.

## Routes

```text
/
/track/{token}
```

## Display

- Order/shipment reference yang aman.
- Current status.
- Shipment timeline.
- Courier/tracking reference bila boleh.
- Estimated delivery bila tersedia.
- Support/login CTA.

Expired/invalid token menggunakan message generik tanpa membocorkan order existence.
