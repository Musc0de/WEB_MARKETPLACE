import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
