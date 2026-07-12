# Addresses dan Wishlist

## Addresses

```text
/dashboard/addresses
/dashboard/addresses/{address_id}
```

Fitur: list, tambah, edit, hapus, set default shipping, set billing. Address yang sudah dipakai
order lama tidak mengubah snapshot order.

Validasi minimal:

- Nama penerima.
- Telepon.
- Baris alamat.
- Kelurahan/kecamatan/kota/provinsi/postal code sesuai kebutuhan provider.
- Label rumah/kantor.

## Wishlist

`dashboard.starsuperscare.net/wishlist`

Fitur:

- Lihat item tersimpan.
- Hapus.
- Tambah ke cart.
- Price drop/restock opt-in.
- Tampilkan status inactive/out-of-stock.

Wishlist guest dari storefront digabung setelah login dengan deduplication berdasarkan
product/variant.
