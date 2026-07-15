import { hc } from 'hono/client';
import type { AppType } from '../../../api/src/app.ts';

// Get the API URL from environment variables, fallback to localhost for development
let apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';
if (typeof window !== 'undefined' && globalThis.location.hostname === '127.0.0.1') {
  apiUrl = apiUrl.replace('localhost', '127.0.0.1');
}
export const API_URL = apiUrl;

// Initialize the RPC client
export const client = hc<AppType>(API_URL, {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    return fetch(input, {
      ...requestInit,
      credentials: 'include',
    });
  },
});

/**
 * Type helper for extracting successful response types from RPC methods
 */
export type ExtractSuccessData<T> = T extends { ok: true; json: () => Promise<infer U> } ? U
  : never;
