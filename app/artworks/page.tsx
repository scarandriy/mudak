import { getArtworks } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ArtworkCard } from '@/features/artworks/components/ArtworkCard';
import { ArtworkFilters } from '@/features/artworks/components/ArtworkFilters';

interface ArtworksPageProps {
  searchParams: Promise<{ artistId?: string; type?: string; sort?: 'recent' | 'popular' }>;
}

export default async function ArtworksPage({ searchParams }: ArtworksPageProps) {
  const params = await searchParams;
  const artworks = await getArtworks(
    { artistId: params.artistId, type: params.type },
    params.sort || 'recent'
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="Artworks" subtitle="Browse our collection" />
      
      <ArtworkFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {artworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} compact />
        ))}
      </div>

      {artworks.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--color-muted-gray)]">No artworks found.</p>
        </div>
      )}
    </div>
  );
}

