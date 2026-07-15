import { useEffect, useState } from 'react';
import { api } from '../../lib/api.ts';
import { Button, Input } from '@starsuperscare/ui';

type AuditLog = {
  id: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  event?: string;
  actor?: { name: string; email: string };
  user?: { name: string; email: string };
  changes?: any;
  metadata?: any;
  createdAt: string;
};

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState<'system' | 'security'>('system');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams({ type });
      if (startDate) query.append('startDate', startDate);
      if (endDate) query.append('endDate', endDate);

      const res = await api.get(`/admin/audit?${query.toString()}`);
      setLogs(res.data as AuditLog[]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [type, startDate, endDate]);

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
        <h2>Audit Logs</h2>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <select
          value={type}
          onChange={(e: any) => setType(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value='system'>System Logs</option>
          <option value='security'>Security Logs</option>
        </select>
        <Input type='date' value={startDate} onChange={(e: any) => setStartDate(e.target.value)} />
        <Input type='date' value={endDate} onChange={(e: any) => setEndDate(e.target.value)} />
        <Button onClick={fetchLogs}>Filter</Button>
      </div>

      {isLoading
        ? <div>Loading logs...</div>
        : (
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem' }}>Time (UTC)</th>
                  <th style={{ padding: '1rem' }}>Actor</th>
                  <th style={{ padding: '1rem' }}>Action / Event</th>
                  <th style={{ padding: '1rem' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      {log.actor?.name || log.user?.name || 'System / Guest'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong>{log.action || log.event}</strong>
                      {log.entityType && <div>{log.entityType}: {log.entityId}</div>}
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '300px', overflowX: 'auto' }}>
                      <pre
                        style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          background: '#f8f8f8',
                          padding: '0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                      {JSON.stringify(log.changes || log.metadata, null, 2)}
                      </pre>
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
