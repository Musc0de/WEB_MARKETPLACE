# Accessibility Requirements

## Keyboard

- Tab order mengikuti visual order.
- Semua menu, modal, drawer, sheet, tabs, accordion, dan table action dapat dioperasikan keyboard.
- Focus terlihat jelas.
- Escape menutup overlay non-kritis.

## Forms

- Setiap field memiliki label programatik.
- Error memakai `aria-describedby` dan ringkasan error untuk form panjang.
- Placeholder bukan pengganti label.
- Password visibility button mempunyai accessible name.

## Status

- Toast dan inline status memakai live region yang tepat.
- Jangan mengumumkan loading berulang kali.
- Update quantity/cart mempunyai status yang dapat dibaca screen reader.

## Visual

- Kontras teks dan control memadai.
- Zoom 200% tidak memotong content/action.
- Informasi tidak hanya memakai warna.
- Animasi mengikuti `prefers-reduced-motion`.

## Media

Gambar produk mempunyai alt yang menjelaskan produk/varian; gambar dekoratif memakai alt kosong. Icon-only button wajib mempunyai label.
