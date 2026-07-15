import React, { useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';
import { Button } from '@starsuperscare/ui';
import { goeyToast as toast } from 'goey-toast';

export function VariantsForm({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New variant state
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(0);

  const fetchVariants = async () => {
    try {
      setIsLoading(true);
      const res = await client.v1.admin.catalog.products[':id'].variants.$get({
        param: { id: productId },
      });
      if (res.ok) {
        const json = await res.json();
        setVariants(json.data as any[]);
      }
    } catch (_e) {
      toast.error('Failed to load variants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { sku, price };
      const res = await client.v1.admin.catalog.products[':id'].variants.$post({
        param: { id: productId },
        json: payload,
      });
      if (!res.ok) throw new Error('Failed to create variant');

      toast.success('Variant created');
      setSku('');
      setPrice(0);
      fetchVariants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error creating variant');
    }
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
      <h3>Product Variants & Pricing</h3>

      {isLoading ? <p>Loading variants...</p> : (
        <div style={{ marginBottom: '2rem' }}>
          {variants.length === 0
            ? <p>No variants configured. Please add a default variant to set the price.</p>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '1rem' }}>SKU</th>
                    <th style={{ padding: '1rem' }}>Price (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{v.sku}</td>
                      <td style={{ padding: '1rem' }}>Rp {v.price.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      )}

      <h4>Add Variant</h4>
      <form
        onSubmit={handleCreate}
        style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}
      >
        <div>
          <label>SKU</label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} required />
        </div>
        <div>
          <label>Price (IDR)</label>
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min={0}
          />
        </div>
        <Button type='submit' disabled={!sku || price <= 0}>Add</Button>
      </form>
    </div>
  );
}
