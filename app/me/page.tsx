import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getRegistrationsByUser } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/ui/Badge';
import Link from 'next/link';
import { EmptyState } from '@/shared/ui/EmptyState';
import { RegistrationList } from '@/features/visitor/components/RegistrationList';

export default async function VisitorDashboard() {
  let user;
  try {
    user = await requireRole('visitor');
  } catch {
    redirect('/login');
  }

  const registrations = await getRegistrationsByUser(user.id);
  const upcomingRegistrations = registrations.filter(r => r.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome, ${user.name}`}
      />

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Upcoming Registrations</h2>
        {upcomingRegistrations.length === 0 ? (
          <EmptyState
            title="No upcoming registrations"
            description="Browse exhibitions to register for events."
            action={
              <Link href="/exhibitions">
                <button className="px-6 py-3 text-sm font-medium bg-black text-white hover:bg-[#333] transition-colors">
                  Browse Exhibitions
                </button>
              </Link>
            }
          />
        ) : (
          <RegistrationList registrations={upcomingRegistrations} />
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6">All Registrations</h2>
        <Link href="/me/registrations" className="text-sm font-medium underline">
          View all registrations →
        </Link>
      </div>
    </div>
  );
}

