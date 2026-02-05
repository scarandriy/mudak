import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getUsersByRole } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { CreateArtworkForm } from '@/features/organizer/components/CreateArtworkForm';

export default async function CreateOrganizerArtworkPage() {
  try {
    await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const artists = await getUsersByRole('artist');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader title="Create Artwork" subtitle="Add a new artwork" />
      <CreateArtworkForm artists={artists} />
    </div>
  );
}

