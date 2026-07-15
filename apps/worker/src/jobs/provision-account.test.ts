import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { handleProvisionAccount } from './provision-account.ts';

describe('Worker - Provision Account', () => {
  it('should throw on invalid payload', async () => {
    await expect(handleProvisionAccount({}, 'event-id')).rejects.toThrow('Invalid order payload');
  });
});
