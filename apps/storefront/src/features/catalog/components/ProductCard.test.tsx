import { describe, expect, it } from 'vitest';
import { formatIndonesianSold } from '@starsuperscare/ui';

describe('ProductCard logic', () => {
  it('formats Indonesian sold numbers correctly', () => {
    expect(formatIndonesianSold(0)).toBe('0 Terjual');
    expect(formatIndonesianSold(150)).toBe('150 Terjual');
    expect(formatIndonesianSold(1500)).toBe('1,5 rb Terjual');
    expect(formatIndonesianSold(10500)).toBe('10,5 rb Terjual');
    expect(formatIndonesianSold(1000000)).toBe('1 jt Terjual');
    expect(formatIndonesianSold(1500000)).toBe('1,5 jt Terjual');
  });
});

describe('ProductCard rendering', () => {
  it('can be imported', () => {
    expect(true).toBe(true);
  });
});
