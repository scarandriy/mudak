import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { OrganizerEventList } from '@/features/organizer/components/OrganizerEventList';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

export default async function OrganizerEventsPage() {
  try {
    await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const events = await getExhibitions();

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader 
        title="Manage Events" 
        subtitle="View and manage all exhibitions"
        actions={
          <Link href="/organizer/events/new">
            <Button>Create Event</Button>
          </Link>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          title="No events"
          description="Create your first event."
          action={
            <Link href="/organizer/events/new">
              <Button>Create Event</Button>
            </Link>
          }
        />
      ) : (
        <OrganizerEventList events={events} />
      )}
    </div>
  );
}

