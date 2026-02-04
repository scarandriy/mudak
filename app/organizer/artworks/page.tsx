import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getArtworks } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { ArtworkCard } from '@/features/artworks/components/ArtworkCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { DeleteArtworkButton } from '@/features/artist/components/DeleteArtworkButton';

export default async function OrganizerArtworksPage() {
  let user;
  try {
    user = await requireRole('organizer');
  } catch {
    redirect('/login');
  }

  const artworks = await getArtworks();

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title="Manage Artworks"
        subtitle="View and manage all artworks"
        actions={
          <Link href="/organizer/artworks/new">
            <Button>Create Artwork</Button>
          </Link>
        }
      />

      {artworks.length === 0 ? (
        <EmptyState
          title="No artworks yet"
          description="Create your first artwork."
          action={
            <Link href="/organizer/artworks/new">
              <Button>Create Artwork</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map(artwork => (
            <div key={artwork.id} className="relative group">
              <ArtworkCard artwork={artwork} />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Link href={`/organizer/artworks/${artwork.id}/edit`}>
                  <Button variant="secondary" className="text-xs py-1 px-3">Edit</Button>
                </Link>
                <DeleteArtworkButton artworkId={artwork.id} artworkTitle={artwork.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


