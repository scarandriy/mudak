import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { PageHeader } from '@/shared/components/PageHeader';
import { ArtistProfileForm } from '@/features/artist/components/ArtistProfileForm';

export default async function ArtistProfilePage() {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <PageHeader title="Edit Profile" subtitle="Update your artist profile" />

      <ArtistProfileForm user={user} />
    </div>
  );
}

