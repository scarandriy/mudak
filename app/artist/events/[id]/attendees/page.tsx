import { redirect, notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitionById, getRegistrationsByExhibition } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';

export default async function EventAttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const { id } = await params;
  const [exhibition, registrations] = await Promise.all([
    getExhibitionById(id),
    getRegistrationsByExhibition(id),
  ]);

  if (!exhibition || exhibition.organizerId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="Event Attendees" subtitle={exhibition.title} />

      <div className="mb-6">
        <p className="text-sm text-[var(--color-muted-gray)]">
          Registered: {registrations.length} / {exhibition.capacity || 'Unlimited'}
        </p>
      </div>

      {registrations.length === 0 ? (
        <EmptyState
          title="No attendees yet"
          description="No one has registered for this event."
        />
      ) : (
        <div className="space-y-2">
          {registrations.map(registration => (
            <div
              key={registration.id}
              className="sm:py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{registration.userName}</p>
                <p className="text-sm text-[var(--color-muted-gray)]">
                  Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="success">Registered</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

