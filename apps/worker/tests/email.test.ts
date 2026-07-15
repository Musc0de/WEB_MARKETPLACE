import { assertEquals } from '@std/assert';
import { templates } from '@starsuperscare/email';
import { handleEmailSend } from '../src/handlers/email.ts';

Deno.test({
  name: 'Email template generation test',
  fn: () => {
    const res = templates.invoice('ORD-123', 'http://dl');
    assertEquals(res.subject, 'Tagihan Pesanan ORD-123');
    assertEquals(typeof handleEmailSend, 'function');
  },
});
