'use client';

import { Exhibition } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import Link from 'next/link';
import { DeleteExhibitionButton } from '@/features/artist/components/DeleteExhibitionButton';

interface OrganizerEventListProps {
  events: Exhibition[];
}

export function OrganizerEventList({ events }: OrganizerEventListProps) {
  return (
    <div className="space-y-6">
      {events.map(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        return (
          <div key={event.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-[var(--color-muted-gray)] mb-2">
                  {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-[var(--color-muted-gray)]">{event.location}</p>
                {event.capacity && (
                  <p className="text-sm text-[var(--color-muted-gray)] mt-2">
                    Capacity: {event.capacity}
                  </p>
                )}
                <p className="text-sm text-[var(--color-muted-gray)] mt-1">
                  Organizer: {event.organizerName}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
              <Link href={`/organizer/events/${event.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Link href={`/exhibitions/${event.id}`}>
                <Button variant="text">View Public Page</Button>
              </Link>
              <DeleteExhibitionButton exhibitionId={event.id} exhibitionTitle={event.title} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

