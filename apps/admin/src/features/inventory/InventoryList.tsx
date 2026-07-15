import { useEffect, useState } from 'react';
import { Button } from '@starsuperscare/ui';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { InventoryAdjustModal } from './InventoryAdjustModal.tsx';

type InventoryLevel = {
  id: string;
  variantId: string;
  warehouseId: string;
  available: number;
  reserved: number;
  damaged: number;
  updatedAt: string;
  variant: {
    sku: string;
  };
  product: {
    name: string;
  };
};

export function InventoryList() {
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adjustingLevel, setAdjustingLevel] = useState<InventoryLevel | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await client.v1.admin.inventory.$get();
      if (!res.ok) throw new Error('Failed to fetch inventory');
      const data = await res.json();
      setLevels(data.data as any);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (isLoading) {
    return <div style={{ padding: '24px' }}>Loading inventory...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Inventory Management</h1>
        <Button onClick={fetchInventory}>Refresh</Button>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>Product</th>
              <th style={{ textAlign: 'left', padding: '12px 16px' }}>SKU</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>Available</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>Reserved</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>Damaged</th>
              <th style={{ textAlign: 'right', padding: '12px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {levels.length === 0
              ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}
                  >
                    No inventory records found.
                  </td>
                </tr>
              )
              : (
                levels.map((level) => (
                  <tr key={level.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{level.product.name}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>
                      {level.variant.sku}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold' }}>
                      {level.available}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{level.reserved}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>{level.damaged}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Button
                        onClick={() => setAdjustingLevel(level)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>

      {adjustingLevel && (
        <InventoryAdjustModal
          variantId={adjustingLevel.variantId}
          warehouseId={adjustingLevel.warehouseId}
          variantName={`${adjustingLevel.product.name} (${adjustingLevel.variant.sku})`}
          onClose={() => setAdjustingLevel(null)}
          onSuccess={() => {
            setAdjustingLevel(null);
            fetchInventory();
          }}
        />
      )}
    </div>
  );
}
