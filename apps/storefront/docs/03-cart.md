# Cart: Guest dan User

## URL

`shop.starsuperscare.net/cart`

## Fitur

- List item, variant, price, quantity, subtotal.
- Tambah/kurangi quantity.
- Hapus item atau kosongkan cart.
- Pilih item untuk checkout.
- Voucher dan catatan.
- Save for later.
- Revalidasi stok/harga.
- Estimasi diskon, pajak, dan pengiriman.

## Guest cart

1. API membuat `guest_cart_token` opaque.
2. Browser menyimpan token; server menyimpan cart dan item.
3. Token tidak mengandung harga atau data sensitif.
4. Guest dapat menambah produk tanpa login.
5. Login/signup diminta saat checkout bila kebijakan memerlukannya.

## User cart

- Terhubung ke `user_id`.
- Tersedia lintas perangkat.
- Expiry lebih panjang daripada guest cart.

## Merge setelah login

1. Baca guest cart dan user cart.
2. Lock kedua cart.
3. Gabungkan item berdasarkan variant dan opsi.
4. Jumlahkan quantity hingga batas stok.
5. Catat item yang berubah harga atau habis.
6. Nonaktifkan guest cart setelah commit.
7. Tampilkan ringkasan merge.

## Perhitungan

Frontend hanya menampilkan hasil server:

```text
subtotal
item_discount
voucher_discount
shipping
shipping_discount
tax
grand_total
```

## Toast

- `Jumlah produk diperbarui`.
- `Harga produk berubah; total sudah dihitung ulang`.
- `Keranjang berhasil digabungkan`.
- `Stok tidak mencukupi`.
