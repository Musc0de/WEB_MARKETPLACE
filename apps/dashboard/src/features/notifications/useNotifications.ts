import { useEffect } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import { API_URL, client } from '../../lib/api.ts';
import { toast } from '@starsuperscare/ui';

export function useNotifications() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/notifications',
    async () => {
      const res = await (client.v1 as any).notifications.$get({ query: { limit: 50, offset: 0 } });
      const json = await res.json();
      return json.data || [];
    },
    {
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
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    },
  );

  useEffect(() => {
    // Connect to SSE stream
    const baseUrl = API_URL.replace(/\/$/, '');
    const eventSource = new EventSource(`${baseUrl}/v1/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.addEventListener('notification', (event) => {
      try {
        const data = JSON.parse(event.data);
        toast.info(data.title, { description: data.body });

        // Refetch notifications
        globalMutate('/api/notifications');
        globalMutate('/api/notifications/unread-count');
      } catch (e) {
        console.error('Error parsing notification', e);
      }
    });

    eventSource.addEventListener('broadcast', (event) => {
      try {
        const data = JSON.parse(event.data);
        toast.info(data.title, { description: data.body });
      } catch (e) {
        console.error('Error parsing broadcast', e);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      // EventSource auto-reconnects, but we can close and recreate if needed
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
