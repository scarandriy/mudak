'use client';

import { Submission } from '@/lib/types';
import { Badge } from '@/shared/ui/Badge';
import Link from 'next/link';

interface ArtistSubmissionListProps {
  submissions: Submission[];
}

export function ArtistSubmissionList({ submissions }: ArtistSubmissionListProps) {
  return (
    <div className="space-y-6">
      {submissions.map(submission => (
        <div key={submission.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{submission.artwork.title}</h3>
              <p className="text-sm text-[var(--color-muted-gray)] mb-2">
                Exhibition:{' '}
                <Link
                  href={`/exhibitions/${submission.exhibitionId}`}
                  className="hover:underline"
                >
                  {submission.exhibitionTitle}
                </Link>
              </p>
              <p className="text-sm text-[var(--color-muted-gray)] mb-2">
                Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
              {submission.feedback && (
                <div className="mt-4 p-4">
                  <p className="text-sm font-medium mb-1">Feedback:</p>
                  <p className="text-sm">{submission.feedback}</p>
                </div>
              )}
            </div>
            <div>
              {submission.status === 'pending' && <Badge>Pending</Badge>}
              {submission.status === 'approved' && <Badge variant="success">Approved</Badge>}
              {submission.status === 'rejected' && <Badge variant="error">Rejected</Badge>}
            </div>
          </div>
          <Link
            href={`/artworks/${submission.artwork.id}`}
            className="text-sm font-medium underline"
          >
            View artwork →
          </Link>
        </div>
      ))}
    </div>
  );
}


