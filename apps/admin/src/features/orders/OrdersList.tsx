import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { Badge } from '@starsuperscare/ui';
import { Button } from '@starsuperscare/ui';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';

export function OrdersList() {
  const [status, setStatus] = useState<string>('all');
  const [page] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', { status, page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status !== 'all') q.set('status', status);
      const res = await api.get('/admin/orders?' + q.toString());
      return res;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
          <p className='text-muted-foreground'>Manage and track all customer orders.</p>
        </div>
        <div className='flex items-center gap-4'>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              outline: 'none',
            }}
          >
            <option value='all'>All Orders</option>
            <option value='pending'>Pending</option>
            <option value='paid'>Paid</option>
            <option value='processing'>Processing</option>
            <option value='shipped'>Shipped</option>
            <option value='delivered'>Delivered</option>
            <option value='cancelled'>Cancelled</option>
            <option value='refunded'>Refunded</option>
          </select>
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
                Order #
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
                Date
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
                Total
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    Loading orders...
                  </td>
                </tr>
              )
              : data?.data?.length === 0
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    No orders found.
                  </td>
                </tr>
              )
              : (
                data?.data?.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{order.customerName || 'Guest'}</span>
                        <span className='text-xs text-muted-foreground'>{order.customerEmail}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {formatIDR(order.totalAmount)}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant='outline' size='sm'>View</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>

      {/* Pagination component goes here, omit for brevity */}
    </div>
  );
}
