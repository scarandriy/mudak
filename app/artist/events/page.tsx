import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitionsByOrganizer } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { DeleteExhibitionButton } from '@/features/artist/components/DeleteExhibitionButton';

export default async function ArtistEventsPage() {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const events = await getExhibitionsByOrganizer(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader
        title="My Events"
        actions={
          <Link href="/artist/events/new">
            <Button>Create Event</Button>
          </Link>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event or exhibition."
          action={
            <Link href="/artist/events/new">
              <Button>Create Event</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {events.map(event => (
            <div key={event.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-[var(--color-muted-gray)] mb-2">
                    {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[var(--color-muted-gray)]">{event.location}</p>
                  {event.verificationFeedback && (
                    <div className="mt-4 p-4">
                      <p className="text-sm font-medium mb-1">Verification Feedback:</p>
                      <p className="text-sm">{event.verificationFeedback}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {event.verified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge>Unverified</Badge>
                  )}
                  {event.isVisible ? (
                    <Badge variant="success">Visible</Badge>
                  ) : (
                    <Badge>Hidden</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <Link href={`/artist/events/${event.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Link href={`/artist/events/${event.id}/attendees`}>
                  <Button variant="text">View Attendees</Button>
                </Link>
                <DeleteExhibitionButton exhibitionId={event.id} exhibitionTitle={event.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

