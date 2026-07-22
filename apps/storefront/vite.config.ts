import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  envDir: '../../',
  envPrefix: ['VITE_', 'MERCHANT_TOKEN', 'BOT_PROTECTION_KEY'],
  plugins: [react(), tailwindcss() as any],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@starsuperscare/ui': resolve(__dirname, '../../packages/ui/index.tsx'),
      '@starsuperscare/config': resolve(__dirname, '../../packages/config/index.ts'),
    },
  },
});
