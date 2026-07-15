import { hc } from 'hono/client';
import type { AppType } from '../../../api/src/app.ts';

// Get the API URL from environment variables, fallback to localhost for development
let apiUrl = 'http://localhost:8000';
if (typeof (import.meta as any).env !== 'undefined') {
  apiUrl = (import.meta as any).env.VITE_API_URL || apiUrl;
}
if (typeof globalThis !== 'undefined' && globalThis.location?.hostname === '127.0.0.1') {
  apiUrl = apiUrl.replace('localhost', '127.0.0.1');
}
export const API_URL = apiUrl;

let authUrl = 'http://localhost:5174';
if (typeof (import.meta as any).env !== 'undefined') {
  authUrl = (import.meta as any).env.VITE_AUTH_URL || authUrl;
}
if (typeof globalThis !== 'undefined' && globalThis.location?.hostname === '127.0.0.1') {
  authUrl = authUrl.replace('localhost', '127.0.0.1');
}
export const AUTH_URL = authUrl;

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
