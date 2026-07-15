import { describe, expect, it } from 'vitest';
import { CartPage } from './CartPage.tsx';

describe('CartPage', () => {
  it('can be imported', () => {
    expect(typeof CartPage).toBe('function');
  });
});
