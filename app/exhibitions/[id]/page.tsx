import { getExhibitionById, getArtworks, getSponsorsByExhibition, getRegistrationsByExhibition, getRegistrationByUserAndExhibition } from '@/lib/data/api';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import { ArtworkCard } from '@/features/artworks/components/ArtworkCard';
import { Badge } from '@/shared/ui/Badge';
import { Divider } from '@/shared/ui/Divider';
import { ExhibitionRegistration } from '@/features/exhibitions/components/ExhibitionRegistration';
import { getServerUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

interface ExhibitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExhibitionDetailPage({ params }: ExhibitionDetailPageProps) {
  const { id } = await params;
  const [exhibition, user] = await Promise.all([
    getExhibitionById(id),
    getServerUser(),
  ]);

  if (!exhibition || !exhibition.isVisible || !exhibition.verified) {
    notFound();
  }

  const artworks = await getArtworks();
  const exhibitionArtworks = artworks.filter(a => exhibition.artworkIds.includes(a.id));
  const sponsors = await getSponsorsByExhibition(exhibition.id);
  const registrations = await getRegistrationsByExhibition(exhibition.id);
  const userRegistration = user ? await getRegistrationByUserAndExhibition(user.id, exhibition.id) : null;

  const startDate = new Date(exhibition.startDate);
  const endDate = new Date(exhibition.endDate);
  const isUpcoming = startDate > new Date();
  const isOngoing = startDate <= new Date() && endDate >= new Date();

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title={exhibition.title}
        metadata={
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-4">
              <span>
                {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} – {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              {isUpcoming && <Badge>Upcoming</Badge>}
              {isOngoing && <Badge variant="success">Ongoing</Badge>}
            </div>
            <span className="text-[var(--color-muted-gray)]">{exhibition.location}</span>
            <span className="text-[var(--color-muted-gray)]">Organized by {exhibition.organizerName}</span>
          </div>
        }
      />

      <div className="mb-12">
        <p className="text-base leading-relaxed whitespace-pre-line max-w-3xl">{exhibition.description}</p>
      </div>

      {exhibition.capacity && (
        <div className="mb-12 text-sm text-[var(--color-muted-gray)]">
          Spots: {registrations.length} / {exhibition.capacity}
        </div>
      )}

      {user?.role === 'visitor' && (
        <div className="mb-12">
          <ExhibitionRegistration
            exhibition={exhibition}
            userId={user.id}
            userName={user.name}
            existingRegistration={userRegistration}
            registeredCount={registrations.length}
          />
        </div>
      )}

      {!user && (
        <div className="mb-12">
          <ExhibitionRegistration exhibition={exhibition} registeredCount={registrations.length} />
        </div>
      )}

      {exhibitionArtworks.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-8">Featured Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {exhibitionArtworks.map(artwork => (
              <ArtworkCard key={artwork.id} artwork={artwork} compact />
            ))}
          </div>
        </>
      )}

      {sponsors.length > 0 && (
        <>
          <Divider />
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Sponsors</h2>
            <div className="flex flex-wrap gap-4">
              {sponsors.map(sponsor => (
                <span key={sponsor.id} className="text-sm text-[var(--color-muted-gray)]">
                  {sponsor.name}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

