import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { Badge } from '@starsuperscare/ui';
import { Button } from '@starsuperscare/ui';
import { Input } from '@starsuperscare/ui';
import { formatDate } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export function CustomersList() {
  const [search, setSearch] = useState('');
  const [page] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', { search, page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (search) q.set('search', search);
      const res = await api.get('/admin/customers?' + q.toString());
      return res;
    },
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Customers</h1>
          <p className='text-muted-foreground'>Manage your store's customers.</p>
        </div>
        <div className='flex items-center gap-4 relative w-72'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search customers...'
            className='pl-8'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='rounded-md border bg-card'>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Customer
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Joined Date
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    Loading customers...
                  </td>
                </tr>
              )
              : data?.data?.length === 0
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    No customers found.
                  </td>
                </tr>
              )
              : (
                data?.data?.map((customer: any) => (
                  <tr key={customer.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {customer.firstName || customer.lastName
                            ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                            : 'No Name'}
                        </span>
                        <span className='text-xs text-muted-foreground'>{customer.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {formatDate(customer.createdAt)}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Link to={`/customers/${customer.id}`}>
                        <Button variant='outline' size='sm'>View</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
