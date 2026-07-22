/// <reference lib="deno.ns" />
import app from './app.ts';
import './cron/payment-expiry.ts';

// 1. Jalankan server secara native jika berada di environment Deno (Local / Deno Deploy)
if (typeof Deno !== 'undefined') {
  const port = parseInt(
    (typeof Deno !== 'undefined' ? Deno.env.get('PORT') : process?.env?.['PORT']) || '8000',
    10,
  );

  console.log(
    JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message: `API Server starting on port ${port}`,
    }),
  );

  Deno.serve(
    {
      port,
      onListen: ({ hostname, port }: { hostname: string; port: number }) => {
        console.log(
          JSON.stringify({
            level: 'INFO',
            timestamp: new Date().toISOString(),
            message: `API Server listening on http://${hostname}:${port}`,
          }),
        );
      },
    },
    app.fetch,
  );
}

// 2. Export app untuk Cloudflare Workers / Vercel Edge
export default app;
