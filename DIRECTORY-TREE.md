# Directory Tree — Blueprint + UI/UX V2

```text
starsuperscare-deno-neon-blueprint/
├── README.md
├── START-HERE.md
├── UI-UX-START-HERE.md
├── UI-UX-IMPLEMENTATION-ORDER.md
├── APPLY-UIUX-V2-PATCH.md
├── PATCH-MANIFEST.md
├── FILES-TO-REPLACE.md
├── MANIFEST.md
├── docs/
│   ├── 00-overview/                 # system architecture
│   └── 01-ui-ux/                    # shared UI/UX rules (20 files)
├── apps/
│   ├── storefront/
│   │   ├── docs/                    # system/feature docs
│   │   └── docs/ui/                 # marketplace desktop/mobile (21 files, termasuk compatibility index)
│   ├── auth/
│   │   └── docs/ui/                 # login/signup/activation/recovery (15 files, termasuk compatibility index)
│   ├── dashboard/
│   │   └── docs/ui/                 # client dashboard desktop/mobile (22 files, termasuk compatibility index)
│   ├── admin/
│   │   └── docs/ui/                 # admin desktop/mobile (18 files, termasuk compatibility index)
│   ├── tracking/
│   │   └── docs/ui/                 # public tracking (5 files)
│   ├── api/
│   └── worker/
├── packages/
│   ├── ui/
│   │   └── docs/                    # design system + Gooey Toast (15 files)
│   ├── database/
│   ├── auth/
│   ├── email/
│   ├── contracts/
│   └── config/
├── infrastructure/
├── quality/                         # system + UI QA checklists
├── references/
└── _templates/
```

## Source code target (tidak dibuat oleh patch dokumentasi)

```text
packages/ui/src/
apps/storefront/src/
apps/auth/src/
apps/dashboard/src/
apps/admin/src/
apps/tracking/src/
```

Lihat `packages/ui/docs/08-code-file-map.md`.
