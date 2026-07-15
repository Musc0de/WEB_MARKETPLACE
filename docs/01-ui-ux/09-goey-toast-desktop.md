# Gooey Toast — Desktop

## Posisi

Default `top-right` dengan offset di bawah header. Gunakan maksimum tiga toast terlihat; sisanya masuk queue.

## Perilaku

- Hover pause aktif.
- Close button berada di kanan atas.
- Action dapat berupa `Undo`, `View order`, `Retry`, atau `Copy`.
- Promise toast dipakai untuk operasi yang selesai dalam durasi pendek.
- Operasi panjang berpindah ke progress/status persisten.

## Spacing

```text
right: 24px
main topbar offset: 80–96px
admin dense header offset: 72–88px
```

## Contoh mapping

- Add to cart: success + `View cart`.
- Save profile: success.
- Export started: info; hasil tersedia di notification center.
- Batch failure: error + `View details`.

## Larangan

Jangan menampilkan credential error hanya lewat toast; tetap tampilkan inline. Jangan menampilkan toast yang menutupi account dropdown atau primary action.
