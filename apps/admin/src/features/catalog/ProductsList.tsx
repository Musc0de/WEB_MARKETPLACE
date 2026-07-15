import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../../lib/rpc.ts';
import { Button } from '@starsuperscare/ui';

// Adjusting type based on what the API returns in GET /v1/admin/catalog/products
type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  type: string;
  price?: number;
};

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        // Assuming the admin catalog API has this endpoint
        const res = await client.v1.admin.catalog.products.$get({
          query: { limit: '50' },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const json = await res.json();
        setProducts(json.data as unknown as Product[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h2>Products</h2>
        <Button onClick={() => navigate('/products/create')}>Create Product</Button>
      </div>

      {isLoading
        ? <div>Loading products...</div>
        : error
        ? <div style={{ color: 'red' }}>Error: {error}</div>
        : products.length === 0
        ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            <h3>No products found</h3>
            <p>Get started by creating your first product.</p>
            <Button onClick={() => navigate('/products/create')} style={{ marginTop: '1rem' }}>
              Create Product
            </Button>
          </div>
        )
        : (
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500' }}>{product.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>{product.slug}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: product.status === 'PUBLISHED' ? '#e6f4ea' : '#f1f3f4',
                          color: product.status === 'PUBLISHED' ? '#137333' : '#3c4043',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{product.type}</td>
                    <td style={{ padding: '1rem' }}>
                      <Button
                        onClick={() =>
                          navigate(`/products/${product.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
