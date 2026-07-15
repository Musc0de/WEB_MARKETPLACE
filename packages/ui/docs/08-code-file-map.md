# UI Source Code File Map

Dokumen ini memetakan file yang **nantinya** dibuat/diubah saat implementasi. Patch dokumentasi
tidak membuat source code ini.

```text
packages/ui/src/
├── tokens/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── radius.css
│   ├── shadows.css
│   ├── motion.css
│   ├── z-index.css
│   └── breakpoints.ts
├── components/
│   ├── button.tsx
│   ├── forms/
│   ├── data-display/
│   ├── navigation/
│   ├── overlays/
│   └── responsive/
├── layouts/
├── feedback/
│   ├── responsive-gooey-toaster.tsx
│   ├── notify.ts
│   └── toast-offset.css
├── styles/globals.css
└── index.ts
```

Setiap app:

```text
apps/<app>/src/
├── layouts/
├── pages/ atau features/<feature>/pages/
├── components/
├── routes/
└── main.tsx
```

`main.tsx` mengimpor global styles dan mount satu toaster root. Page tidak boleh membuat toaster
baru.
