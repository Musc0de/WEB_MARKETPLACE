import app from './src/app.ts';
const req = new Request(
  'http://localhost:8000/v1/orders/7d3a6152-a55c-4a9f-8ea9-ba0c5497fccb/invoice',
);
const res = await app.fetch(req, { env: Deno.env.toObject() });
console.log(await res.text());
Deno.exit(0);
