import { assertEquals } from '@std/assert';
import { formatIndonesianSold } from '../src/modules/catalog/stats.ts';

Deno.test({
  name: 'Catalog Stats: Formatting Indonesian Sold Labels',
  fn() {
    assertEquals(formatIndonesianSold(500), '500 Terjual');
    assertEquals(formatIndonesianSold(999), '999 Terjual');
    assertEquals(formatIndonesianSold(1000), '1 rb Terjual');
    assertEquals(formatIndonesianSold(1200), '1,2 rb Terjual');
    assertEquals(formatIndonesianSold(1250), '1,3 rb Terjual'); // toFixed rounds up
    assertEquals(formatIndonesianSold(10500), '10,5 rb Terjual');
    assertEquals(formatIndonesianSold(999900), '999,9 rb Terjual');
    assertEquals(formatIndonesianSold(1000000), '1 jt Terjual');
    assertEquals(formatIndonesianSold(1500000), '1,5 jt Terjual');
    assertEquals(formatIndonesianSold(10500000), '10,5 jt Terjual');
  },
});
