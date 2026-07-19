import useSWR from 'swr';
import { AUTH_URL, client } from '../../lib/api.ts';

const fetchSession = async () => {
  const res = await client.v1.auth.me.$get();
  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Gagal memuat sesi');
  }
  const result = await res.json();
  if (!result.data || !result.data.user) return null;
  return result.data;
};

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR('/api/v1/auth/me', fetchSession, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const logout = async () => {
    try {
      await client.v1.auth.logout.$post();
      await mutate(null, false);
      globalThis.location.href = `${AUTH_URL}/login`;
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return {
    session: data,
    isLoading,
    isError: !!error,
    logout,
    mutate,
  };
}
