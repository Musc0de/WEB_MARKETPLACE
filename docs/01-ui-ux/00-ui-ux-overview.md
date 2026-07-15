# UI/UX Overview

## Tujuan

UI StarSuperScare harus terasa konsisten walaupun dibagi menjadi storefront, auth, dashboard, admin, dan tracking. Shared design system berada di `packages/ui`, sedangkan komposisi halaman tetap berada di masing-masing aplikasi.

## Sasaran pengalaman

- Guest dapat menemukan produk dan masuk ke cart tanpa dipaksa login.
- Client dapat menyelesaikan checkout dengan informasi harga dan status yang jelas.
- User yang menerima akun otomatis dapat mengaktifkan akun tanpa menerima password melalui email.
- Dashboard membuat status order, invoice, download, refund, dan support mudah ditemukan.
- Admin dapat menyelesaikan pekerjaan padat data dengan cepat dan aman.

## Prinsip arsitektur UI

- Shared primitive, bukan shared business page.
- Satu sumber token.
- Satu wrapper toast.
- Desktop dan mobile berbeda komposisi, tetapi memakai domain state yang sama.
- Semua action penting memiliki loading, success, error, disabled, dan retry state.
- Semua destructive action mempunyai confirmation dan audit consequence yang jelas.

## Aplikasi

| App | Fokus UI |
|---|---|
| Storefront | discovery, comparison, purchase |
| Auth | trust, clarity, recovery |
| Dashboard | ownership, status, self-service |
| Admin | density, speed, risk control |
| Tracking | quick public status lookup |

## Definition of done

Sebuah halaman dianggap selesai ketika layout desktop dan mobile, loading, empty, error, permission, accessibility, toast, analytics event, dan acceptance criteria telah didokumentasikan serta diuji.
