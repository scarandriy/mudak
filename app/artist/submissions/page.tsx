import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getSubmissionsByArtist } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ArtistSubmissionList } from '@/features/artist/components/ArtistSubmissionList';
import { EmptyState } from '@/shared/ui/EmptyState';

export default async function ArtistSubmissionsPage() {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const submissions = await getSubmissionsByArtist(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="My Submissions" subtitle="View your artwork submissions" />

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions"
          description="You haven't submitted any artworks to exhibitions yet."
        />
      ) : (
        <ArtistSubmissionList submissions={submissions} />
      )}
    </div>
  );
}


