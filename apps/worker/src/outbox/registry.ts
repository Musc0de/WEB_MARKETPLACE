export type OutboxEventHandler = (payload: unknown, eventId: string) => Promise<void>;

export class HandlerRegistry {
  private handlers = new Map<string, OutboxEventHandler[]>();

  register(eventType: string, handler: OutboxEventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  getHandler(eventType: string): OutboxEventHandler | undefined {
    const handlers = this.handlers.get(eventType);
    if (!handlers || handlers.length === 0) return undefined;

    return async (payload: unknown, eventId: string) => {
      // Execute all registered handlers for this event type sequentially
      for (const handler of handlers) {
        await handler(payload, eventId);
      }
    };
  }
}

export const defaultRegistry = new HandlerRegistry();

import { handleOrderPaid } from '../handlers/invoice.ts';
import { handleEmailSend, handleEmailVerificationRequested, handlePasswordResetRequested } from '../handlers/email.ts';
import { handleProvisionAccount } from '../jobs/provision-account.ts';
import { handleNotificationCreate } from '../jobs/notifications.ts';

export function initializeHandlers(registry: HandlerRegistry = defaultRegistry) {
  registry.register('order.paid', handleOrderPaid);
  registry.register('order.paid', handleProvisionAccount);
  registry.register('notification.create', handleNotificationCreate);
  registry.register('email.send', handleEmailSend);
  registry.register('email_verification_requested', handleEmailVerificationRequested);
  registry.register('password_reset_requested', handlePasswordResetRequested);

  registry.register('test.error', () => {
    throw new Error('Simulated failure');
  });
}
