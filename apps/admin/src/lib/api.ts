import { API_URL } from './rpc.ts';

async function fetchApi(path: string, options: RequestInit = {}) {
  const url = API_URL + '/v1' + path;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  get: (path: string) => fetchApi(path),
  post: (path: string, body: any) => fetchApi(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) => fetchApi(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => fetchApi(path, { method: 'DELETE' }),
};
