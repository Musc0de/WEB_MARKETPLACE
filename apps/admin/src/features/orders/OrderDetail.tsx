import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.ts';
import { Badge } from '@starsuperscare/ui';
import { Button } from '@starsuperscare/ui';
import { formatDate, formatIDR } from '@starsuperscare/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@starsuperscare/ui';
import { Input } from '@starsuperscare/ui';
import { toast } from '@starsuperscare/ui';
import { ArrowLeft, Package, Truck } from 'lucide-react';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [newStatus, setNewStatus] = useState<string>('');
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => {
      const res = await api.get(`/admin/orders/${id}`);
      return res;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await api.post(`/admin/orders/${id}/status`, { status });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', id] });
      toast.success('Status updated successfully');
    },
  });

  const attachShipment = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/admin/orders/${id}/shipments`, {
        carrier,
        trackingNumber: tracking,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', id] });
      setCarrier('');
      setTracking('');
      toast.success('Shipment attached successfully');
    },
  });

  if (isLoading) return <div className='p-10 text-center'>Loading...</div>;
  if (!order) return <div className='p-10 text-center'>Order not found</div>;

  return (
    <div className='space-y-6 p-6 max-w-6xl mx-auto'>
      <div className='flex items-center gap-4'>
        <Link to='/orders'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Order {order.orderNumber}</h1>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-muted-foreground'>{formatDate(order.createdAt)}</span>
            <Badge variant='outline'>{order.status}</Badge>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center py-2 border-b last:border-0'
                  >
                    <div>
                      <p className='font-medium'>{item.productNameSnapshot}</p>
                      <p className='text-sm text-muted-foreground'>
                        SKU: {item.variantSkuSnapshot} x {item.quantity}
                      </p>
                    </div>
                    <div className='font-medium'>
                      {formatIDR(item.priceSnapshot * item.quantity)}
                    </div>
                  </div>
                ))}

                <div className='pt-4 space-y-2 text-right'>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Subtotal</span>
                    <span>{formatIDR(order.subtotalAmount)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className='flex justify-between text-muted-foreground'>
                      <span>Discount</span>
                      <span>-{formatIDR(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Shipping</span>
                    <span>{formatIDR(order.shippingAmount)}</span>
                  </div>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Tax</span>
                    <span>{formatIDR(order.taxAmount)}</span>
                  </div>
                  <div className='flex justify-between font-bold text-lg pt-2 border-t'>
                    <span>Total</span>
                    <span>{formatIDR(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent'>
                {order.history.map((h: any) => (
                  <div
                    key={h.id}
                    className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'
                  >
                    <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10'>
                      <Package className='h-4 w-4' />
                    </div>
                    <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border bg-card shadow'>
                      <div className='flex items-center justify-between mb-1'>
                        <Badge variant='outline'>{h.status}</Badge>
                        <time className='text-xs text-muted-foreground'>
                          {new Date(h.createdAt).toLocaleString()}
                        </time>
                      </div>
                      {h.note && <div className='text-sm text-slate-500'>{h.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm space-y-2'>
                <p>
                  <strong>Email:</strong> {order.emailSnapshot}
                </p>
                {order.userId && (
                  <Link
                    to={`/customers/${order.userId}`}
                    className='text-primary hover:underline'
                  >
                    View Customer Profile
                  </Link>
                )}

                {order.shippingSnapshot && (
                  <div className='mt-4 pt-4 border-t'>
                    <p className='font-semibold mb-1'>Shipping Address</p>
                    <p className='text-muted-foreground'>
                      {order.shippingSnapshot.recipientName}
                      <br />
                      {order.shippingSnapshot.addressLine1}
                      <br />
                      {order.shippingSnapshot.addressLine2 && (
                        <>
                          {order.shippingSnapshot.addressLine2}
                          <br />
                        </>
                      )}
                      {order.shippingSnapshot.city}, {order.shippingSnapshot.state}{' '}
                      {order.shippingSnapshot.postalCode}
                      <br />
                      {order.shippingSnapshot.country}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Update Status</label>
                <div className='flex gap-2'>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                    }}
                  >
                    <option value='processing'>Processing</option>
                    <option value='shipped'>Shipped</option>
                    <option value='delivered'>Delivered</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>
                  <Button
                    disabled={!newStatus || updateStatus.isPending}
                    onClick={() => updateStatus.mutate(newStatus)}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className='pt-4 border-t space-y-3'>
                <label className='text-sm font-medium'>Attach Shipment</label>
                <Input
                  placeholder='Carrier (e.g. FedEx)'
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                />
                <Input
                  placeholder='Tracking Number'
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
                <Button
                  variant='outline'
                  className='w-full'
                  disabled={!carrier || attachShipment.isPending}
                  onClick={() => attachShipment.mutate()}
                >
                  <Truck className='h-4 w-4 mr-2' />
                  Save Shipment
                </Button>
              </div>
            </CardContent>
          </Card>

          {order.shipments && order.shipments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {order.shipments.map((ship: any) => (
                    <div key={ship.id} className='text-sm border-l-2 pl-3 py-1'>
                      <p className='font-semibold'>{ship.carrier}</p>
                      <p className='text-muted-foreground'>
                        {ship.trackingNumber || 'No tracking'}
                      </p>
                      <Badge variant='secondary' className='mt-1'>{ship.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
