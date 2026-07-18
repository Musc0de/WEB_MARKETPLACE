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
    let errMsg = res.statusText;
    try {
      const data = await res.json();
      if (data.error) errMsg = data.error;
    } catch {
      // Ignore JSON parsing error if the response is not JSON
    }
    throw new Error(errMsg);
  }
  return res.json();
}

export const api = {
  get: (path: string) => fetchApi(path),
  post: (path: string, body: any) => fetchApi(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) => fetchApi(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path: string, body: any) =>
    fetchApi(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => fetchApi(path, { method: 'DELETE' }),
};
