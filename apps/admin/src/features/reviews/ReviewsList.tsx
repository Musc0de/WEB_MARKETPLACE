import { useEffect, useState } from 'react';
import { api } from '../../lib/api.ts';
import { Button, Input } from '@starsuperscare/ui';
import { goeyToast as toast } from 'goey-toast';

type Review = {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: { id: string; name: string };
  product: { id: string; name: string };
};

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'approved' | 'rejected' | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/reviews');
      setReviews(res.data as Review[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async () => {
    if (!selectedReviewId || !modalAction || !moderationReason) {
      toast.error('Please provide a reason');
      return;
    }

    try {
      await api.post(`/admin/reviews/${selectedReviewId}/moderate`, {
        status: modalAction,
        reason: moderationReason,
      });
      toast.success(`Review ${modalAction}`);
      setModalAction(null);
      setSelectedReviewId(null);
      setModerationReason('');
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message || 'Moderation failed');
    }
  };

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
        <h2>Review Moderation Queue</h2>
      </div>

      {isLoading
        ? <div>Loading reviews...</div>
        : error
        ? <div style={{ color: 'red' }}>Error: {error}</div>
        : reviews.length === 0
        ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            <h3>No reviews found</h3>
          </div>
        )
        : (
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem' }}>Product & User</th>
                  <th style={{ padding: '1rem' }}>Rating</th>
                  <th style={{ padding: '1rem' }}>Content</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500' }}>{r.product.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>By: {r.user.name}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{r.rating} / 5</td>
                    <td style={{ padding: '1rem' }}>
                      <strong>{r.title}</strong>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>{r.content}</p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: r.moderationStatus === 'approved'
                            ? '#e6f4ea'
                            : r.moderationStatus === 'rejected'
                            ? '#fce8e6'
                            : '#fef7e0',
                          color: r.moderationStatus === 'approved'
                            ? '#137333'
                            : r.moderationStatus === 'rejected'
                            ? '#c5221f'
                            : '#b06000',
                        }}
                      >
                        {r.moderationStatus.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {r.moderationStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button
                            onClick={() => {
                              setSelectedReviewId(r.id);
                              setModalAction('approved');
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant='destructive'
                            onClick={() => {
                              setSelectedReviewId(r.id);
                              setModalAction('rejected');
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {modalAction && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}
          >
            <h3>Confirm {modalAction === 'approved' ? 'Approval' : 'Rejection'}</h3>
            <div style={{ marginTop: '1rem' }}>
              <label>Reason (Required for audit logs)</label>
              <Input
                value={moderationReason}
                onChange={(e: any) => setModerationReason(e.target.value)}
                placeholder='e.g. Verified genuine review / Contains profanity'
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <Button
                variant='secondary'
                onClick={() => {
                  setModalAction(null);
                  setSelectedReviewId(null);
                  setModerationReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant={modalAction === 'rejected' ? 'destructive' : 'default'}
                onClick={handleModerate}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
