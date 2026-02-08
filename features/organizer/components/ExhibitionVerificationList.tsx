'use client';

import { useState } from 'react';
import { Exhibition } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ExhibitionVerificationListProps {
  exhibitions: Exhibition[];
}

export function ExhibitionVerificationList({ exhibitions }: ExhibitionVerificationListProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const handleVerify = async (exhibitionId: string) => {
    setProcessingId(exhibitionId);
    try {
      const response = await fetch(`/api/exhibitions/${exhibitionId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          verified: true,
          feedback: feedback[exhibitionId] || null,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert(`Failed to verify exhibition: ${result.error || 'Unknown error'}`);
      }
    } catch {
      alert('Failed to verify exhibition');
    } finally {
      setProcessingId(null);
      setShowFeedback({ ...showFeedback, [exhibitionId]: false });
    }
  };

  const handleReject = async (exhibitionId: string) => {
    if (!feedback[exhibitionId] && !confirm('Reject without feedback?')) {
      return;
    }
    setProcessingId(exhibitionId);
    try {
      const response = await fetch(`/api/exhibitions/${exhibitionId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          verified: false,
          feedback: feedback[exhibitionId] || null,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert(`Failed to reject exhibition: ${result.error || 'Unknown error'}`);
      }
    } catch {
      alert('Failed to reject exhibition');
    } finally {
      setProcessingId(null);
      setShowFeedback({ ...showFeedback, [exhibitionId]: false });
    }
  };

  return (
    <div className="w-full space-y-4">
      {exhibitions.map(exhibition => {
        const startDate = new Date(exhibition.startDate);
        const endDate = new Date(exhibition.endDate);

        return (
          <div key={exhibition.id} className="w-full sm:py-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <Link href={`/exhibitions/${exhibition.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold">{exhibition.title}</h3>
                </Link>
                <p className="text-sm text-[var(--color-muted-gray)] mt-1">
                  by{' '}
                  <Link
                    href={`/artists/${exhibition.organizerId}`}
                    className="hover:underline"
                  >
                    {exhibition.organizerName}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted-gray)] sm:text-right shrink-0">
                <span>{startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}</span>
                <span>·</span>
                <span>{exhibition.location}</span>
                {exhibition.capacity && (
                  <>
                    <span>·</span>
                    <span>Capacity: {exhibition.capacity}</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm mb-4">{exhibition.description}</p>

            {showFeedback[exhibition.id] && (
              <div className="mb-4">
                <Textarea
                  label="Feedback (optional)"
                  value={feedback[exhibition.id] || ''}
                  onChange={(e) =>
                    setFeedback({ ...feedback, [exhibition.id]: e.target.value })
                  }
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => handleVerify(exhibition.id)}
                disabled={processingId === exhibition.id}
              >
                {processingId === exhibition.id ? 'Processing...' : 'Verify'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleReject(exhibition.id)}
                disabled={processingId === exhibition.id}
              >
                {processingId === exhibition.id ? 'Processing...' : 'Reject'}
              </Button>
              <Button
                variant="text"
                onClick={() =>
                  setShowFeedback({
                    ...showFeedback,
                    [exhibition.id]: !showFeedback[exhibition.id],
                  })
                }
              >
                {showFeedback[exhibition.id] ? 'Hide Feedback' : 'Add Feedback'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


