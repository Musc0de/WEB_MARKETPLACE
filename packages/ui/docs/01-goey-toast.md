# Shared Gooey Toast Integration

Package yang digunakan adalah `goey-toast`. API package dapat berubah antar versi; seluruh aplikasi
wajib memakai wrapper lokal agar upgrade terisolasi.

## Current integration contract

```text
packages/ui/src/feedback/
├── responsive-gooey-toaster.tsx
├── notify.ts
├── toast-context.tsx
└── toast-offset.css
```

Wrapper mengekspor:

- `notify.default`
- `notify.success`
- `notify.error`
- `notify.warning`
- `notify.info`
- `notify.promise`
- `notify.update`
- `notify.dismiss`

## Mount rule

Import stylesheet package sekali pada entry/root UI, lalu mount tepat satu toaster per frontend.

```tsx
<ResponsiveGooeyToaster />;
```

Jangan mount pada page/card/modal.

## Responsive position

- Desktop/tablet landscape: `top-right`.
- Mobile: `bottom-center`.
- Offset menggunakan layout context CSS variables.

## Capabilities yang dapat digunakan

Gunakan type variants, promise transition, action, update, dismiss, queue, hover pause, close
button, mobile swipe, dan reduced-motion sesuai versi package yang terpasang. Jangan mengasumsikan
option yang belum tersedia; wrapper harus diuji terhadap type definitions versi lockfile.

## Boundaries

Toast bukan pengganti:

- inline field error
- error summary
- modal confirmation
- long-running job center
- persistent notification inbox
- payment result page

## Naming

Package bernama `goey-toast`, sedangkan export versi terkini memakai nama seperti `GooeyToaster` dan
`gooeyToast`. Aplikasi tidak mengimpor export tersebut langsung; hanya wrapper `notify` yang boleh
melakukannya.
