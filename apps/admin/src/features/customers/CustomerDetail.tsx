import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.ts';
import { Badge } from '@starsuperscare/ui';
import { Button } from '@starsuperscare/ui';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@starsuperscare/ui';
import { ArrowLeft, CreditCard, ShoppingBag, User } from 'lucide-react';

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['admin', 'customers', id],
    queryFn: async () => {
      const res = await api.get(`/admin/customers/${id}`);
      return res;
    },
  });

  if (isLoading) return <div className='p-10 text-center'>Loading...</div>;
  if (!customer) return <div className='p-10 text-center'>Customer not found</div>;

  return (
    <div className='space-y-6 p-6 max-w-5xl mx-auto'>
      <div className='flex items-center gap-4'>
        <Link to='/customers'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {customer.firstName || customer.lastName
              ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
              : 'Customer Profile'}
          </h1>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-muted-foreground'>{customer.email}</span>
            <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
              {customer.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='md:col-span-1'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-3'>
              <User className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Joined</p>
                <p className='text-sm text-muted-foreground'>{formatDate(customer.createdAt)}</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <ShoppingBag className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Total Orders</p>
                <p className='text-sm text-muted-foreground'>{customer.orderCount} orders</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <CreditCard className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Total Spent</p>
                <p className='text-sm text-muted-foreground'>
                  {formatIDR(customer.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm'>
              Customer activity log will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
