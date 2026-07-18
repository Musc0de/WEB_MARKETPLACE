import useSWR from 'swr';
import { client } from '../../../lib/api.ts';

const authFetcher = async () => {
  const res = await client.v1.auth.me.$get();
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  const data = await res.json();
  return data.data;
};

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR('/api/v1/auth/me', authFetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false, // Prevents excessive calls when switching tabs
  });

  return {
    user: data?.user || null,
    session: data?.session || null,
    permissions: data?.permissions || [],
    isLoading,
    isError: error,
    mutate,
  };
}
