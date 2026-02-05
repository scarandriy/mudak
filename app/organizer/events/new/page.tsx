import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getArtworks } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { CreateEventForm } from '@/features/artist/components/CreateEventForm';

export default async function CreateOrganizerEventPage() {
  let user;
  try {
    user = await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const artworks = await getArtworks();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="Create Event" subtitle="Create a new exhibition or event" />
      <CreateEventForm organizerId={user.id} organizerName={user.name} artworks={artworks} />
    </div>
  );
}


