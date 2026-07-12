import app from './app.ts';

const port = parseInt(Deno.env.get('PORT') || '8000', 10);

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
    onListen: ({ hostname, port }) => {
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
