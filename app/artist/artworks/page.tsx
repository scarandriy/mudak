import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getArtworksByArtist } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { ArtworkCard } from '@/features/artworks/components/ArtworkCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { DeleteArtworkButton } from '@/features/artist/components/DeleteArtworkButton';

export default async function ArtistArtworksPage() {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const artworks = await getArtworksByArtist(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader
        title="My Artworks"
        actions={
          <Link href="/artist/artworks/new">
            <Button>Upload Artwork</Button>
          </Link>
        }
      />

      {artworks.length === 0 ? (
        <EmptyState
          title="No artworks yet"
          description="Upload your first artwork to get started."
          action={
            <Link href="/artist/artworks/new">
              <Button>Upload Artwork</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map(artwork => (
            <div key={artwork.id} className="relative group">
              <ArtworkCard artwork={artwork} />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Link href={`/artist/artworks/${artwork.id}/edit`}>
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

