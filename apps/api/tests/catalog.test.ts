import { assert, assertEquals } from '@std/assert';
import app from '../src/app.ts';

Deno.test({
  name: 'Catalog API: Categories and Brands',
  async fn() {
    // 1. Fetch categories
    const reqCat = new Request('http://localhost/v1/catalog/categories');
    const resCat = await app.request(reqCat);
    assertEquals(resCat.status, 200);
    const jsonCat = await resCat.json();
    assert(Array.isArray(jsonCat.data));

    // 2. Fetch brands
    const reqBrand = new Request('http://localhost/v1/catalog/brands');
    const resBrand = await app.request(reqBrand);
    assertEquals(resBrand.status, 200);
    const jsonBrand = await resBrand.json();
    assert(Array.isArray(jsonBrand.data));
  },
});

Deno.test({
  name: 'Catalog API: Products List and Detail',
  async fn() {
    // 1. Fetch product list
    const reqList = new Request('http://localhost/v1/catalog/products?per_page=10');
    const resList = await app.request(reqList);
    assertEquals(resList.status, 200);
    const jsonList = await resList.json();
    assert(Array.isArray(jsonList.data.items));
    assertEquals(jsonList.data.perPage, 10);
    assertEquals(typeof jsonList.data.total, 'number');

    if (jsonList.data.items.length > 0) {
      const firstItem = jsonList.data.items[0];

      // 2. Fetch product detail
      const reqDetail = new Request(`http://localhost/v1/catalog/products/${firstItem.slug}`);
      const resDetail = await app.request(reqDetail);
      assertEquals(resDetail.status, 200);
      const jsonDetail = await resDetail.json();
      assertEquals(jsonDetail.data.slug, firstItem.slug);
      assert(Array.isArray(jsonDetail.data.variants));
    }
  },
});
