# Design Principles

## 1. Jelas sebelum dekoratif

Harga, stok, status pembayaran, status pengiriman, dan konsekuensi action selalu lebih dominan daripada ornament visual.

## 2. Progressive disclosure

Detail teknis, metadata, atau opsi jarang dipakai ditempatkan pada accordion, drawer, detail panel, atau halaman lanjutan.

## 3. Consistent action hierarchy

- Primary: satu action terpenting per area.
- Secondary: action alternatif yang aman.
- Tertiary/ghost: navigation atau low-emphasis action.
- Destructive: merah dan memerlukan confirmation bila tidak mudah dibatalkan.

## 4. Responsive by composition

Mobile bukan desktop yang diperkecil. Table menjadi card/list, filter menjadi sheet, sidebar menjadi drawer/bottom navigation, dan CTA penting menjadi sticky.

## 5. Feedback berlapis

- Inline validation untuk field.
- Button loading untuk action aktif.
- Gooey Toast untuk hasil singkat.
- Notification center untuk event persisten.
- Modal untuk keputusan berisiko.

## 6. Trust pada commerce

Total, diskon, biaya pengiriman, pajak, status refund, dan availability tidak boleh tersembunyi atau dihitung hanya di client.

## 7. Accessible by default

Semua komponen harus dapat digunakan dengan keyboard, screen reader, zoom 200%, contrast yang memadai, dan reduced motion.
