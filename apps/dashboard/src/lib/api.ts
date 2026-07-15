import { hc } from 'hono/client';
import type { AppType } from '../../../api/src/app.ts';

const envApiUrl = (import.meta as any).env?.VITE_API_URL;
if (!envApiUrl) {
  throw new Error('VITE_API_URL is missing in environment variables');
}
export const API_URL = envApiUrl;

const envAuthUrl = (import.meta as any).env?.VITE_AUTH_URL;
if (!envAuthUrl) {
  throw new Error('VITE_AUTH_URL is missing in environment variables');
}
export const AUTH_URL = envAuthUrl;

// Initialize the RPC client
export const client = hc<AppType>(API_URL, {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    return fetch(input, {
      ...requestInit,
      credentials: 'include', // Important to send cookies (session)
    });
  },
});

/**
 * Type helper for extracting successful response types from RPC methods
 */
export type ExtractSuccessData<T> = T extends { ok: true; json: () => Promise<infer U> } ? U
  : never;
