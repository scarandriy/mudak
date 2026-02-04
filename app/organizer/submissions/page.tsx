import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ExhibitionVerificationList } from '@/features/organizer/components/ExhibitionVerificationList';
import { EmptyState } from '@/shared/ui/EmptyState';

export default async function SubmissionsPage() {
  let user;
  try {
    user = await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const allExhibitions = await getExhibitions(false);
  const unverifiedExhibitions = allExhibitions.filter(ex => !ex.verified);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="Review Submissions" subtitle="Verify exhibitions" />

      {unverifiedExhibitions.length === 0 ? (
        <EmptyState
          title="No pending verifications"
          description="All exhibitions have been verified."
        />
      ) : (
        <ExhibitionVerificationList exhibitions={unverifiedExhibitions} />
      )}
    </div>
  );
}

