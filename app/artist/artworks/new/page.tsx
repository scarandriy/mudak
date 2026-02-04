import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { PageHeader } from '@/shared/components/PageHeader';
import { UploadArtworkForm } from '@/features/artist/components/UploadArtworkForm';

export default async function UploadArtworkPage() {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <PageHeader title="Upload Artwork" subtitle="Add a new artwork to your collection" />

      <UploadArtworkForm artistId={user.id} artistName={user.name} />
    </div>
  );
}

