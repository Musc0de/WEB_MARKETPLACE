import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
const env = await load({ envPath: '../../.env' });
console.log('env file:', env['R2_PUBLIC_URL_2']);
console.log('Deno env:', Deno.env.get('R2_PUBLIC_URL_2'));
