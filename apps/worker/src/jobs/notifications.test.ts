import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { handleNotificationCreate } from './notifications.ts';

describe('Worker - Notifications', () => {
  it('should throw on invalid payload', async () => {
    await expect(handleNotificationCreate({})).rejects.toThrow('Invalid notification payload');
  });
});
