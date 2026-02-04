import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitionsByOrganizer, getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';

export default async function OrganizerDashboard() {
  let user;
  try {
    user = await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const [events, allExhibitions] = await Promise.all([
    getExhibitionsByOrganizer(user.id),
    getExhibitions(false),
  ]);

  const unverifiedExhibitions = allExhibitions.filter(ex => !ex.verified);
  const totalRegistrations = events.reduce((sum, event) => sum + (event.capacity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title="Organizer Dashboard"
        subtitle={`Welcome, ${user.name}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{events.length}</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Events Managed</p>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{unverifiedExhibitions.length}</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Pending Verifications</p>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{totalRegistrations}</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Total Capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/organizer/submissions" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Review Submissions</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">
            {unverifiedExhibitions.length} pending verification{unverifiedExhibitions.length !== 1 ? 's' : ''}
          </p>
        </Link>
        <Link href="/organizer/events" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Manage Events</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </Link>
        <Link href="/organizer/artworks" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Manage Artworks</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">View and manage all artworks</p>
        </Link>
      </div>
    </div>
  );
}

