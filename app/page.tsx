import { getArtworks, getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ArtworkCard } from '@/features/artworks/components/ArtworkCard';
import { ExhibitionCard } from '@/features/exhibitions/components/ExhibitionCard';

export default async function Home() {
  const [recentArtworks, popularArtworks, allExhibitions] = await Promise.all([
    getArtworks(undefined, 'recent'),
    getArtworks(undefined, 'popular'),
    getExhibitions(true),
  ]);

  const featuredArtworks = recentArtworks.slice(0, 3);
  const popularArtworksList = popularArtworks.slice(0, 4);
  
  // Filter for upcoming exhibitions (start date in the future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingExhibitionsList = allExhibitions
    .filter(exhibition => {
      const startDate = new Date(exhibition.startDate);
      startDate.setHours(0, 0, 0, 0);
      return startDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title="Contemporary Art & Exhibitions"
        subtitle="Discover artworks, exhibitions, and cultural events"
      />

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Exhibitions</h2>
        {upcomingExhibitionsList.length === 0 ? (
          <p className="text-[var(--color-muted-gray)]">No upcoming exhibitions at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingExhibitionsList.map(exhibition => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Recent Artworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentArtworks.slice(0, 8).map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} compact />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Popular Artworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularArtworksList.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
