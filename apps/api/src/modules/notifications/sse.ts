import { SSEStreamingApi } from 'hono/streaming';

type ClientParams = {
  stream: SSEStreamingApi;
  userId?: string;
  id: string; // Unique connection ID
};

class SSEManager {
  private clients = new Map<string, ClientParams>();

  addClient(clientId: string, stream: SSEStreamingApi, userId?: string) {
    const clientParams: ClientParams = { stream, id: clientId };
    if (userId !== undefined) {
      clientParams.userId = userId;
    }
    this.clients.set(clientId, clientParams);

    // Setup ping to keep connection alive
    const interval = setInterval(() => {
      try {
        stream.writeSSE({ event: 'ping', data: 'ping' });
      } catch (_err) {
        this.removeClient(clientId);
      }
    }, 15000);

    // Provide cleanup function
    return () => {
      clearInterval(interval);
      this.removeClient(clientId);
    };
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }

  // Broadcast to all connected clients (e.g. for new product)
  broadcast(event: string, data: any) {
    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.stream.writeSSE({ event, data: JSON.stringify(data) });
      } catch (_err) {
        this.removeClient(clientId);
      }
    }
  }

  // Send to a specific user (can have multiple active connections/tabs)
  sendToUser(userId: string, event: string, data: any) {
    for (const [clientId, client] of this.clients.entries()) {
      if (client.userId === userId) {
        try {
          client.stream.writeSSE({ event, data: JSON.stringify(data) });
        } catch (_err) {
          this.removeClient(clientId);
        }
      }
    }
  }
}

export const sseManager = new SSEManager();
