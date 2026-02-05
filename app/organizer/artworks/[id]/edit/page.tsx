import { redirect, notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getArtworkById, getUsersByRole } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { EditArtworkForm } from '@/features/artist/components/EditArtworkForm';

export default async function EditOrganizerArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const { id } = await params;
  const [artwork, artists] = await Promise.all([
    getArtworkById(id),
    getUsersByRole('artist'),
  ]);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="Edit Artwork" subtitle={artwork.title} />
      <EditArtworkForm artwork={artwork} artists={artists} />
    </div>
  );
}

