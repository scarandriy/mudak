import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getRegistrationsByUser } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { RegistrationList } from '@/features/visitor/components/RegistrationList';
import { EmptyState } from '@/shared/ui/EmptyState';

export default async function RegistrationsPage() {
  let user;
  try {
    user = await requireRole('visitor');
  } catch {
    redirect('/login');
  }

  const registrations = await getRegistrationsByUser(user.id);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="My Registrations" subtitle="View and manage your event registrations" />

      {registrations.length === 0 ? (
        <EmptyState
          title="No registrations"
          description="You haven't registered for any exhibitions yet."
        />
      ) : (
        <RegistrationList registrations={registrations} />
      )}
    </div>
  );
}

