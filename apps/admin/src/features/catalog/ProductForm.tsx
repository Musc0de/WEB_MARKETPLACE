import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { Button } from '@starsuperscare/ui';
import { goeyToast as toast } from 'goey-toast';
import { AdminProductCreateSchema } from '@starsuperscare/contracts';
import { ImageUploader } from './ImageUploader.tsx';
import { VariantsForm } from './VariantsForm.tsx';

export function ProductForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeId: '', // Ideally fetched from context
    name: '',
    type: 'physical',
    description: '',
    purchaseLimit: 0,
    version: 1,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Unsaved changes guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    globalThis.addEventListener('beforeunload', handleBeforeUnload);
    return () => globalThis.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (isEditing) {
      // Fetch product data
      const fetchProduct = async () => {
        try {
          const res = await client.v1.admin.catalog.products[':id'].$get({ param: { id } });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              storeId: data.data.storeId,
              name: data.data.name,
              type: data.data.type,
              description: data.data.description || '',
              purchaseLimit: data.data.purchaseLimit || 0,
              version: data.data.version || 1,
            });
          }
        } catch (_e) {
          toast.error('Failed to fetch product details');
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        const payload = {
          version: formData.version,
          name: formData.name,
          type: formData.type as 'physical' | 'digital' | 'service',
          description: formData.description,
          purchaseLimit: formData.purchaseLimit,
        };
        const res = await client.v1.admin.catalog.products[':id'].$put({
          param: { id },
          json: payload,
        });
        if (!res.ok) throw new Error('Update failed');
        toast.success('Product updated successfully');
      } else {
        // Need storeId for creating. Normally this is the user's default store.
        // For MVP, we will use a dummy UUID if empty.
        const storeId = formData.storeId || crypto.randomUUID();

        const payload = {
          storeId,
          name: formData.name,
          type: formData.type as 'physical' | 'digital' | 'service',
          description: formData.description,
          purchaseLimit: formData.purchaseLimit,
        };

        const parsed = AdminProductCreateSchema.safeParse(payload);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }

        const res = await client.v1.admin.catalog.products.$post({ json: parsed.data });
        if (!res.ok) throw new Error('Create failed');
        toast.success('Product created successfully');
        navigate('/products');
      }
      setIsDirty(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', background: '#fff', padding: '2rem', borderRadius: '8px' }}>
      <h2>{isEditing ? 'Edit Product' : 'Create Product'}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {!isEditing && (
          <div>
            <label>Store ID (Required for creation)</label>
            <input name='storeId' value={formData.storeId} onChange={handleChange} required />
          </div>
        )}

        <div>
          <label>Product Name</label>
          <input name='name' value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Product Type</label>
          <select name='type' value={formData.type} onChange={handleChange}>
            <option value='physical'>Physical Product (Requires shipping)</option>
            <option value='digital'>Digital Product (Downloadable)</option>
            <option value='service'>Service (No shipping)</option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', minHeight: '100px', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label>Purchase Limit (0 = unlimited)</label>
          <input
            type='number'
            name='purchaseLimit'
            value={formData.purchaseLimit}
            onChange={handleNumberChange}
            min={0}
          />
        </div>

        {formData.type === 'physical' && (
          <div style={{ padding: '1rem', background: '#f8f8f8', border: '1px dashed #ccc' }}>
            <p>
              <strong>Physical Details:</strong>{' '}
              Weight and Dimensions will be configured in Variants.
            </p>
          </div>
        )}

        {formData.type === 'digital' && (
          <div style={{ padding: '1rem', background: '#e6f7ff', border: '1px dashed #91d5ff' }}>
            <p>
              <strong>Digital Content:</strong>{' '}
              You will be able to upload files after creating the product.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type='submit' disabled={isSaving || (!isDirty && isEditing)}>
            {isSaving ? 'Saving...' : 'Save Product'}
          </Button>
          <Button
            type='button'
            onClick={() => {
              if (
                isDirty &&
                !globalThis.confirm('You have unsaved changes. Are you sure you want to leave?')
              ) {
                return;
              }
              navigate('/products');
            }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {isEditing && id && (
        <>
          <VariantsForm productId={id} />

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
            <h3>Product Assets</h3>
            <ImageUploader productId={id} />
          </div>
        </>
      )}
    </div>
  );
}
