import { useEffect, useState } from 'react';
import { api } from '../../lib/api.ts';

export function DashboardCards() {
  const [metrics, setMetrics] = useState({
    pendingOrders: 0,
    failedPayments: 0,
    lowStockVariants: 0,
    pendingEmails: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await api.get('/admin/overview');
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const Card = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div
      style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        borderTop: `4px solid ${color}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          color: '#666',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{value}</div>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Operational Overview</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <Card title='Pending Orders' value={metrics.pendingOrders} color='#3b82f6' />
        <Card title='Failed Payments (24h)' value={metrics.failedPayments} color='#ef4444' />
        <Card title='Low Stock Variants' value={metrics.lowStockVariants} color='#f59e0b' />
        <Card title='Pending Emails / Outbox' value={metrics.pendingEmails} color='#10b981' />
      </div>
    </div>
  );
}
