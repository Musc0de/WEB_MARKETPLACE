import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  H3,
  Skeleton,
  Small,
  Text,
} from '@starsuperscare/ui';

interface TrackingData {
  orderStatus: string;
  shipment: {
    courier: string;
    trackingNumber: string;
    status: string;
    estimatedDeliveryAt: string | null;
    events: Array<{
      status: string;
      location: string | null;
      description: string;
      occurredAt: string;
    }>;
  } | null;
}

export function TrackingPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracking() {
      try {
        const res = await fetch(`/api/v1/tracking/${token}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error?.message || 'Failed to fetch tracking data');
        }

        setData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchTracking();
    }
  }, [token]);

  if (loading) {
    return (
      <div className='container mx-auto max-w-2xl p-6'>
        <Skeleton className='h-8 w-1/3 mb-4' />
        <Skeleton className='h-48 w-full' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='container mx-auto max-w-2xl p-6 text-center'>
        <H3 className='mb-4 text-destructive'>Tracking Information Unavailable</H3>
        <Text>
          {error || 'The tracking link may be invalid, expired, or revoked.'}
        </Text>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-2xl p-6 space-y-6'>
      <H3>Shipment Tracking</H3>

      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between border-b pb-4'>
            <Small className='text-gray-500'>Order Status</Small>
            <Badge variant='outline'>{data.orderStatus.toUpperCase()}</Badge>
          </div>

          {data.shipment
            ? (
              <>
                <div className='flex justify-between border-b pb-4'>
                  <Small className='text-gray-500'>Courier</Small>
                  <Text className='font-semibold !mt-0'>{data.shipment.courier}</Text>
                </div>
                <div className='flex justify-between border-b pb-4'>
                  <Small className='text-gray-500'>Tracking Number</Small>
                  <Text className='font-mono !mt-0'>{data.shipment.trackingNumber}</Text>
                </div>
                <div className='flex justify-between border-b pb-4'>
                  <Small className='text-gray-500'>Current Status</Small>
                  <Badge>{data.shipment.status.replace(/_/g, ' ').toUpperCase()}</Badge>
                </div>
                {data.shipment.estimatedDeliveryAt && (
                  <div className='flex justify-between pb-2'>
                    <Small className='text-gray-500'>Estimated Delivery</Small>
                    <Text className='!mt-0'>
                      {new Date(data.shipment.estimatedDeliveryAt).toLocaleDateString()}
                    </Text>
                  </div>
                )}
              </>
            )
            : (
              <div className='py-4 text-center text-gray-500'>
                Your order is being processed and has not been shipped yet.
              </div>
            )}
        </CardContent>
      </Card>

      {data.shipment && data.shipment.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='relative border-l-2 border-gray-200 ml-3 space-y-6'>
              {data.shipment.events.map((event, index) => (
                <div key={index} className='relative pl-6'>
                  <div className='absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-white' />
                  <div className='flex flex-col'>
                    <Small className='font-semibold'>
                      {event.description}
                    </Small>
                    <Small className='text-gray-500'>
                      {new Date(event.occurredAt).toLocaleString()}
                      {event.location && ` • ${event.location}`}
                    </Small>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
