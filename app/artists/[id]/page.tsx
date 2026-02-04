import { notFound } from 'next/navigation';
import { getUserById, getArtworksByArtist, getExhibitionsByArtist } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ArtworkCard } from '@/features/artworks/components/ArtworkCard';
import { ExhibitionCard } from '@/features/exhibitions/components/ExhibitionCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Divider } from '@/shared/ui/Divider';
import Link from 'next/link';

interface ArtistProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistProfilePage({ params }: ArtistProfilePageProps) {
  const { id } = await params;
  const [artist, artworks, exhibitions] = await Promise.all([
    getUserById(id),
    getArtworksByArtist(id),
    getExhibitionsByArtist(id),
  ]);

  if (!artist || artist.role !== 'artist') {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title={artist.name}
        subtitle={artist.bio || 'Artist'}
      />

      {(artist.contact || artist.socialLinks) && (
        <div className="mb-12 space-y-2">
          {artist.contact && (
            <p className="text-sm text-[var(--color-muted-gray)]">
              Contact: {artist.contact}
            </p>
          )}
          {artist.socialLinks && (
            <div className="flex gap-4 text-sm">
              {artist.socialLinks.website && (
                <a
                  href={artist.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted-gray)] hover:underline"
                >
                  Website
                </a>
              )}
              {artist.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${artist.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted-gray)] hover:underline"
                >
                  Instagram
                </a>
              )}
              {artist.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${artist.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-muted-gray)] hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <Divider />

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Artworks</h2>
        {artworks.length === 0 ? (
          <EmptyState
            title="No artworks"
            description="This artist hasn't uploaded any artworks yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} compact />
            ))}
          </div>
        )}
      </div>

      <Divider />

      <div>
        <h2 className="text-2xl font-semibold mb-6">Exhibitions</h2>
        {exhibitions.length === 0 ? (
          <EmptyState
            title="No exhibitions"
            description="This artist's artworks haven't appeared in any exhibitions yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map(exhibition => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

