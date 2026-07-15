# Design Tokens

## Struktur token

```text
packages/ui/src/tokens/
├── colors.css
├── typography.css
├── spacing.css
├── radius.css
├── shadows.css
├── motion.css
├── z-index.css
└── breakpoints.ts
```

## Warna semantik

Gunakan token semantik, bukan nama warna langsung:

- `--color-bg-canvas`
- `--color-bg-surface`
- `--color-bg-elevated`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border-default`
- `--color-action-primary`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-info`

## Spacing

Basis 4px:

```text
0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
```

## Radius

- Input/button: 10–12px.
- Card: 14–18px.
- Dialog/drawer: 18–24px.
- Pill/badge: 999px.

## Typography

- Display hanya untuk hero.
- Heading memakai scale yang konsisten.
- Body default minimum 16px pada mobile.
- Metadata minimum 12px, tetapi jangan dipakai untuk informasi kritis.
- Nominal uang memakai angka tabular bila tersedia.

## Motion

- Fast: 120–160ms.
- Standard: 180–240ms.
- Emphasized: 280–420ms.
- Jangan membuat layout bergeser tanpa alasan.
- `prefers-reduced-motion` menonaktifkan transform berlebihan.

## Z-index

Urutan: base, sticky, dropdown, overlay, modal, toast. Toast harus di atas modal hanya ketika feedback memang terkait action modal; otherwise gunakan inline status di modal.
