/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STOREFRONT_URL: string;
  readonly VITE_AUTH_URL: string;
  readonly VITE_DASHBOARD_URL: string;
  readonly VITE_ADMIN_URL: string;
  readonly VITE_TRACKING_URL: string;
  readonly VITE_R2_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
