import { useEffect } from 'react';
import { API_URL } from './api.ts';
import { toast } from '@starsuperscare/ui';

export function useSSE() {
  useEffect(() => {
    const baseUrl = API_URL.replace(/\/$/, '');
    const eventSource = new EventSource(`${baseUrl}/v1/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.addEventListener('notification', (event) => {
      try {
        const data = JSON.parse(event.data);
        // Show personal notification for logged-in user
        toast.info(data.title, { description: data.body });
      } catch (e) {
        console.error('Error parsing notification', e);
      }
    });

    eventSource.addEventListener('broadcast', (event) => {
      try {
        const data = JSON.parse(event.data);
        // Global broadcast (e.g. New Product), shown to both guests and logged-in users
        toast.info(data.title, { description: data.body });
      } catch (e) {
        console.error('Error parsing broadcast', e);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);
}
