# Auth Session and Security UI States

## Session expired

Tampilkan message sebelum login: `Sesi Anda berakhir. Masuk kembali untuk melanjutkan.` Pertahankan
safe return path dan non-sensitive draft.

## Rate limited

Tampilkan waktu tunggu atau retry-after yang diberikan server. Jangan membuat countdown jika tidak
akurat.

## Account inactive/locked

Gunakan copy generik yang aman, activation/resend/support path, dan jangan mengungkap internal risk
signal.

## Multi-device/logout

Logout current dan logout all devices harus mempunyai hasil jelas. Logout all dapat memerlukan
password/re-authentication.

## Security event

Perubahan password, email, 2FA, dan session revoke menghasilkan notification persisten selain toast.
