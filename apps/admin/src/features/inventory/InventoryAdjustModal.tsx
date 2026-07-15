import React, { useState } from 'react';
import { Button } from '@starsuperscare/ui';
import { client } from '../../lib/rpc.ts';
import { goeyToast as toast } from 'goey-toast';
import { z } from 'zod';
import { InventoryAdjustmentRequestSchema } from '@starsuperscare/contracts';

interface InventoryAdjustModalProps {
  variantId: string;
  warehouseId: string;
  variantName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function InventoryAdjustModal({
  variantId,
  warehouseId,
  variantName,
  onClose,
  onSuccess,
}: InventoryAdjustModalProps) {
  const [delta, setDelta] = useState('');
  const [type, setType] = useState<'receive' | 'adjust'>('adjust');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsedDelta = parseInt(delta, 10);

    try {
      InventoryAdjustmentRequestSchema.parse({
        variantId,
        warehouseId,
        delta: parsedDelta,
        type,
        note,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((i) => {
          if (i.path[0]) newErrors[i.path[0].toString()] = i.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await client.v1.admin.inventory.adjust.$post({
        json: {
          variantId,
          warehouseId,
          delta: parsedDelta,
          type,
          note,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error((errorData as any).error?.message || 'Failed to adjust stock');
        return;
      }

      toast.success('Stock adjusted successfully');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          Adjust Stock for {variantName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Adjustment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
              }}
            >
              <option value='adjust'>Manual Adjustment (e.g., Audit)</option>
              <option value='receive'>Receive New Stock (PO)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Delta (Quantity to add/subtract)
            </label>
            <input
              type='number'
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              placeholder='e.g., 5 or -2'
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                borderColor: errors.delta ? 'red' : '#d1d5db',
              }}
            />
            {errors.delta && <span style={{ color: 'red', fontSize: '12px' }}>{errors.delta}</span>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Reason/Note
            </label>
            <input
              type='text'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='e.g., Found extra in backroom'
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                borderColor: errors.note ? 'red' : '#d1d5db',
              }}
            />
            {errors.note && <span style={{ color: 'red', fontSize: '12px' }}>{errors.note}</span>}
          </div>

          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}
          >
            <Button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm Adjustment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
