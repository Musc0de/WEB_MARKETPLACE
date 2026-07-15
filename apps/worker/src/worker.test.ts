import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
/// <reference lib="deno.ns" />
import { handleShutdown } from './main.ts';

Deno.test('Worker handleShutdown triggers cleanly without throwing', () => {
  // This is a basic sanity check for the worker lifecycle functions.
  // We can't easily test the while loop without mocking, but we can verify
  // that handleShutdown executes cleanly.
  let errorCaught = false;
  try {
    handleShutdown('SIGTEST');
  } catch (_err) {
    errorCaught = true;
  }
  assertEquals(errorCaught, false);
});
