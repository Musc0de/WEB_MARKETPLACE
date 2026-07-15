import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
  resolve: {
    alias: {
      '@starsuperscare/ui': resolve(__dirname, '../../packages/ui/index.tsx'),
      '@starsuperscare/config': resolve(__dirname, '../../packages/config/index.ts'),
    },
  },
});
