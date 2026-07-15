import { hc } from 'hono/client';
import type { AppType } from '../../../api/src/app.ts';

const envApiUrl = (import.meta as any).env?.VITE_API_URL;
if (!envApiUrl) {
  throw new Error('VITE_API_URL is missing in environment variables');
}
export const API_BASE_URL = envApiUrl;

// Setup global Hono client instance with credentials included for cookies/CSRF
export const apiClient = hc<AppType>(API_BASE_URL, {
  headers: {
    // Optionally include common headers here, like CSRF tokens if needed later
  },
  // We cannot pass credentials here directly in hc options across all requests in this version,
  // but we can pass it per fetch using the fetch overrides:
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    return fetch(input, {
      ...requestInit,
      credentials: 'include', // Important for sending/receiving secure HttpOnly cookies
    });
  },
});

/**
 * Standard typed error response from backend:
 * { error: { code: string, message: string, details?: any } }
 */
export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && data.error && typeof data.error.message === 'string') {
      return data.error.message;
    }
    return response.statusText || 'An unknown error occurred';
  } catch (_e) {
    return response.statusText || 'Failed to parse error response';
  }
}
