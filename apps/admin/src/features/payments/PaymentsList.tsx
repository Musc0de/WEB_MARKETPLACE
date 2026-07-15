import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { Badge } from '@starsuperscare/ui';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';

export function PaymentsList() {
  const [page] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'payments', { page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await api.get('/admin/payments/payments?' + q.toString());
      return res;
    },
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Payments</h1>
          <p className='text-muted-foreground'>Monitor payment transactions.</p>
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
                Order
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
                Provider
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
                Transaction ID
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
                Amount
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
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    Loading payments...
                  </td>
                </tr>
              )
              : data?.data?.length === 0
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    No payments found.
                  </td>
                </tr>
              )
              : (
                data?.data?.map((payment: any) => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {formatDate(payment.createdAt)}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Link
                        to={`/orders/${payment.orderId}`}
                        className='text-primary hover:underline'
                      >
                        {payment.orderNumber || payment.orderId.split('-')[0]}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {payment.provider}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {payment.providerTransactionId || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {formatIDR(payment.amount)}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Badge
                        variant={payment.status === 'default'
                          ? 'default'
                          : payment.status === 'failed'
                          ? 'destructive'
                          : 'outline'}
                      >
                        {payment.status}
                      </Badge>
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
