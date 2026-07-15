import { hc } from 'hono/client';
import type { AppType } from '../../../api/src/app.ts';

// Get the API URL from environment variables, fallback to localhost for development
const envApiUrl = (import.meta as any).env?.VITE_API_URL;
if (!envApiUrl) {
  throw new Error('VITE_API_URL is missing in environment variables');
}
export const API_URL = envApiUrl.endsWith('/') ? envApiUrl : `${envApiUrl}/`;
console.log(`[RPC Client] Initialized with API_URL: ${API_URL}`);

// Initialize the RPC client
export const client = hc<AppType>(API_URL, {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    const headers = new Headers(requestInit?.headers);
    if (typeof window !== 'undefined') {
      const guestToken = localStorage.getItem('guestToken');
      if (guestToken) {
        headers.set('X-Cart-Token', guestToken);
      }
    }

    return fetch(input, {
      ...requestInit,
      headers,
      credentials: 'include',
    });
  },
});

/**
 * Type helper for extracting successful response types from RPC methods
 */
export type ExtractSuccessData<T> = T extends { ok: true; json: () => Promise<infer U> } ? U
  : never;
