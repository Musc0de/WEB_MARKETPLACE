# Responsive Breakpoints

## Breakpoint referensi

| Nama | Rentang | Penggunaan |
|---|---:|---|
| xs | 320–479 | ponsel kecil |
| sm | 480–767 | ponsel besar |
| md | 768–1023 | tablet/compact desktop |
| lg | 1024–1279 | desktop standar |
| xl | 1280–1535 | desktop lebar |
| 2xl | ≥1536 | layar sangat lebar |

Breakpoints adalah referensi komposisi. Gunakan container query untuk komponen reusable bila lebih tepat.

## Viewport wajib QA

```text
320×568
360×800
390×844
412×915
768×1024
1024×768
1280×720
1440×900
1920×1080
```

## Aturan layout

- Mobile: satu kolom, margin 16px.
- Tablet: 20–24px, dua kolom bila konten memungkinkan.
- Desktop: max content width 1200–1440px sesuai app.
- Admin boleh lebih lebar untuk table, tetapi tetap mempunyai readable detail panel.

## Safe area

Gunakan `env(safe-area-inset-top/right/bottom/left)` untuk bottom navigation, sticky CTA, toast, dan full-screen sheet.
