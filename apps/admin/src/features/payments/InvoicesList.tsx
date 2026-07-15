import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.ts';
import { Badge } from '@starsuperscare/ui';
import { Button } from '@starsuperscare/ui';
import { formatDate } from '@starsuperscare/ui';
import { Link } from 'react-router-dom';
import { toast } from '@starsuperscare/ui';
import { Mail } from 'lucide-react';

export function InvoicesList() {
  const [page] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'invoices', { page, limit }],
    queryFn: async () => {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await api.get('/admin/payments/invoices?' + q.toString());
      return res;
    },
  });

  const resendInvoice = useMutation({
    mutationFn: (id: string) => {
      return api.post(`/admin/payments/invoices/${id}/resend`, {});
    },
    onSuccess: () => {
      toast.success('Invoice resend job queued successfully');
    },
  });

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Invoices</h1>
          <p className='text-muted-foreground'>Manage order invoices.</p>
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
                Invoice #
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
                Issued At
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
                    Loading invoices...
                  </td>
                </tr>
              )
              : data?.data?.length === 0
              ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    No invoices found.
                  </td>
                </tr>
              )
              : (
                data?.data?.map((invoice: any) => (
                  <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {invoice.invoiceNumber}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Link
                        to={`/orders/${invoice.orderId}`}
                        className='text-primary hover:underline'
                      >
                        {invoice.orderNumber || invoice.orderId.split('-')[0]}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {formatDate(invoice.issuedAt)}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Badge
                        variant={invoice.status === 'paid'
                          ? 'default'
                          : invoice.status === 'void'
                          ? 'destructive'
                          : 'secondary'}
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          resendInvoice.mutate(invoice.id)}
                        disabled={resendInvoice.isPending}
                      >
                        <Mail className='h-4 w-4 mr-2' />
                        Resend
                      </Button>
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
