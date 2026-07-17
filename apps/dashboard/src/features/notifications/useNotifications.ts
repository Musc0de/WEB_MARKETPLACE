import useSWR from 'swr';
import { client } from '../../lib/api.ts';
import { useEffect } from 'react';
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
      refreshInterval: 300000, // Poll every 5 min (SSE handles real-time updates)
      revalidateOnFocus: false,
      dedupingInterval: 30000,
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
      refreshInterval: 300000, // Poll every 5 min
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    },
  );

  // Setup SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connectSSE = () => {
      // Connect to the stream endpoint
      // Ensure we use the proper API URL
      const apiUrl = (import.meta as any).env?.VITE_API_URL;
      if (!apiUrl) throw new Error('VITE_API_URL is missing in environment variables');
      eventSource = new EventSource(`${apiUrl}/v1/notifications/stream`, {
        withCredentials: true,
      });

      eventSource.onmessage = (_event) => {
        // Unhandled standard messages
      };

      eventSource.addEventListener('notification', (event) => {
        try {
          const payload = JSON.parse(event.data);
          // Show toast
          toast.info(payload.body, {});
          // Mutate the SWR caches so the list and badge are updated from DB
          mutate();
          mutateUnread();
        } catch (e) {
          console.error('Failed to parse notification payload', e);
        }
      });

      eventSource.addEventListener('heartbeat', () => {
        // Keep-alive signal
      });

      eventSource.onerror = (err) => {
        console.error('SSE Error', err);
        eventSource?.close();
        // Reconnect after 3s
        retryTimeout = setTimeout(connectSSE, 3000);
      };

      eventSource.onopen = () => {
        // When reconnected, refresh cache to catch up on missed notifications
        mutate();
        mutateUnread();
      };
    };

    connectSSE();

    return () => {
      clearTimeout(retryTimeout);
      eventSource?.close();
    };
  }, [mutate, mutateUnread]);

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
