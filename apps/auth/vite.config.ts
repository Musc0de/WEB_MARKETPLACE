import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  envDir: '../../',
  plugins: [react(), tailwindcss() as any],
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@starsuperscare/ui': resolve(__dirname, '../../packages/ui/index.tsx'),
      '@starsuperscare/config': resolve(__dirname, '../../packages/config/index.ts'),
    },
  },
});
