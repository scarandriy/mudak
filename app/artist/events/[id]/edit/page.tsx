import { redirect, notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getExhibitionById, getArtworksByArtist } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { EditEventForm } from '@/features/artist/components/EditEventForm';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const { id } = await params;
  const [exhibition, artworks] = await Promise.all([
    getExhibitionById(id),
    getArtworksByArtist(user.id),
  ]);

  if (!exhibition || exhibition.organizerId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="Edit Event" subtitle={exhibition.title} />
      <EditEventForm exhibition={exhibition} artworks={artworks} />
    </div>
  );
}

