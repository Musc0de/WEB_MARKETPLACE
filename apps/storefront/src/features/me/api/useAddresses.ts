import useSWR from 'swr';
import { client } from '../../../lib/api.ts';

const addressesFetcher = async () => {
  const res = await client.v1.me.addresses.$get();
  if (!res.ok) {
    throw new Error('Failed to fetch addresses');
  }
  const data = await res.json();
  return data.data || [];
};

export function useAddresses(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? '/api/v1/me/addresses' : null,
    addressesFetcher,
    {
      revalidateOnFocus: false, // Don't overfetch
    },
  );

  return {
    addresses: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
