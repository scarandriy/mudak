import { redirect } from 'next/navigation';
import { requireAnyRole } from '@/lib/auth/server';
import { getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ExhibitionVerificationList } from '@/features/organizer/components/ExhibitionVerificationList';
import { EmptyState } from '@/shared/ui/EmptyState';

export default async function SubmissionsPage() {
  try {
    await requireAnyRole(['organizer', 'admin']);
  } catch {
    redirect('/login');
  }

  const allExhibitions = await getExhibitions(false);
  const unverifiedExhibitions = allExhibitions.filter(ex => !ex.verified);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
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

