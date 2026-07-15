# Forms and Validation

## Layout

Desktop dapat memakai dua kolom untuk field yang berhubungan; mobile selalu satu kolom kecuali input pendek yang sangat jelas.

## Validation

- Client validation untuk feedback cepat.
- Server validation tetap menjadi sumber kebenaran.
- Error tampil di bawah field dan, untuk form panjang, pada error summary.
- Focus berpindah ke error pertama setelah submit gagal.
- Nilai user tidak hilang kecuali field sensitif.

## Async validation

Username, voucher, stock, dan payment method memakai state idle/loading/available/unavailable. Debounce input dan batalkan request lama.

## Destructive forms

Return/refund/admin adjustment menyertakan reason, impact summary, confirmation, dan audit metadata.
