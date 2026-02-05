import { redirect, notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getArtworkById } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { EditArtworkForm } from '@/features/artist/components/EditArtworkForm';

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork || artwork.artistId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="Edit Artwork" subtitle={artwork.title} />
      <EditArtworkForm artwork={artwork} />
    </div>
  );
}


