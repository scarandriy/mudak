import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth/server';
import { getArtworksByArtist, getExhibitionsByOrganizer } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';

export default async function ArtistDashboard() {
  let user;
  try {
    user = await requireRole('artist');
  } catch {
    redirect('/login');
  }

  const [artworks, events] = await Promise.all([
    getArtworksByArtist(user.id),
    getExhibitionsByOrganizer(user.id),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <PageHeader
        title="Artist Dashboard"
        subtitle={`Welcome, ${user.name}`}
        actions={
          <Link href="/artist/profile">
            <Button variant="secondary">Edit Profile</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{artworks.length}</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Artworks</p>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{events.length}</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Events</p>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2">{events.filter(e => e.isVisible).length}</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Visible Events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/artist/artworks/new" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Upload Artwork</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Add a new artwork to your collection</p>
        </Link>
        <Link href="/artist/events/new" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Create Event</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">Create a new exhibition or event</p>
        </Link>
        <Link href="/artist/artworks" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Manage Artworks</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">View and edit your artworks</p>
        </Link>
        <Link href="/artist/events" className="group p-6 block">
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">Manage Events</h3>
          <p className="text-sm text-[var(--color-muted-gray)]">View and edit your events</p>
        </Link>
      </div>
    </div>
  );
}

