import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  // Load env vars from the monorepo root (../../) so VITE_API_URL is available
  const env = loadEnv(mode, resolve(__dirname, '../../'), '');
  const apiTarget = env.VITE_API_URL || '';

  return {
    envDir: '../../',
    plugins: [react(), tailwindcss() as any],
    server: {
      port: 5175,
      strictPort: true,
      proxy: {
        // /api/v1/* → backend API (reads target from VITE_API_URL in .env)
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/v1/, '/v1'),
        },
      },
    },
    resolve: {
      alias: {
        '@starsuperscare/ui': resolve(__dirname, '../../packages/ui/index.tsx'),
        '@starsuperscare/config': resolve(__dirname, '../../packages/config/index.ts'),
      },
    },
  };
});
