import useSWR from 'swr';
import { client } from '../../lib/api.ts';

export function useNotifications() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/notifications',
    async () => {
      const res = await (client.v1 as any).notifications.$get({ query: { limit: 50, offset: 0 } });
      const json = await res.json();
      return json.data || [];
    },
    {
      refreshInterval: 30000, // Poll every 30s (Scalable for marketplace, avoids SSE connection limits)
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    },
  );

  const { data: unreadData, mutate: mutateUnread } = useSWR(
    '/api/notifications/unread-count',
    async () => {
      const res = await (client.v1 as any).notifications['unread-count'].$get();
      const json = await res.json();
      return (json as any).data?.count || 0;
    },
    {
      refreshInterval: 30000, // Poll every 30s
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    },
  );

  const markAsRead = async (id: string) => {
    await (client.v1 as any).notifications[':id'].read.$post({ param: { id } });
    mutate();
    mutateUnread();
  };

  const markAllAsRead = async () => {
    await (client.v1 as any).notifications['read-all'].$post();
    mutate();
    mutateUnread();
  };

  return {
    notifications: data,
    unreadCount: unreadData,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  };
}
