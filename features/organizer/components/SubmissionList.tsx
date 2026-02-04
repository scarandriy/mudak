'use client';

import { useState } from 'react';
import { Submission } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SubmissionListProps {
  submissions: Submission[];
}

export function SubmissionList({ submissions }: SubmissionListProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const handleApprove = async (submissionId: string) => {
    setProcessingId(submissionId);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          feedback: feedback[submissionId],
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert('Failed to approve submission');
      }
    } catch (error) {
      alert('Failed to approve submission');
    } finally {
      setProcessingId(null);
      setShowFeedback({ ...showFeedback, [submissionId]: false });
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!feedback[submissionId] && !confirm('Reject without feedback?')) {
      return;
    }
    setProcessingId(submissionId);
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          feedback: feedback[submissionId],
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert('Failed to reject submission');
      }
    } catch (error) {
      alert('Failed to reject submission');
    } finally {
      setProcessingId(null);
      setShowFeedback({ ...showFeedback, [submissionId]: false });
    }
  };

  return (
    <div className="space-y-6">
      {submissions.map(submission => (
        <div key={submission.id} className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{submission.artwork.title}</h3>
            <p className="text-sm text-[var(--color-muted-gray)] mb-2">
              Artist:{' '}
              <Link
                href={`/artists/${submission.artwork.artistId}`}
                className="hover:underline"
              >
                {submission.artwork.artistName}
              </Link>
            </p>
            <p className="text-sm text-[var(--color-muted-gray)] mb-2">
              Exhibition: {submission.exhibitionTitle}
            </p>
            <p className="text-sm mb-4">{submission.artwork.description}</p>
            <Link
              href={`/artworks/${submission.artwork.id}`}
              className="text-sm font-medium underline"
            >
              View artwork →
            </Link>
          </div>

          {showFeedback[submission.id] && (
            <div className="mb-4">
              <Textarea
                label="Feedback (optional)"
                value={feedback[submission.id] || ''}
                onChange={(e) =>
                  setFeedback({ ...feedback, [submission.id]: e.target.value })
                }
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => handleApprove(submission.id)}
              disabled={processingId === submission.id}
            >
              {processingId === submission.id ? 'Processing...' : 'Approve'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReject(submission.id)}
              disabled={processingId === submission.id}
            >
              {processingId === submission.id ? 'Processing...' : 'Reject'}
            </Button>
            <Button
              variant="text"
              onClick={() =>
                setShowFeedback({
                  ...showFeedback,
                  [submission.id]: !showFeedback[submission.id],
                })
              }
            >
              {showFeedback[submission.id] ? 'Hide Feedback' : 'Add Feedback'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

