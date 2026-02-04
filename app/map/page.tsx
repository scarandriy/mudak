import { getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';

export default async function MapPage() {
  const exhibitions = await getExhibitions(true);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="Exhibition Map" subtitle="Locations and venues" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-[4/3] bg-[var(--color-light-gray)] border border-[var(--color-border)] flex items-center justify-center">
            <p className="text-[var(--color-muted-gray)]">Map Canvas</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-6">Locations</h2>
          <div className="space-y-4">
            {exhibitions.map(exhibition => (
              <div key={exhibition.id} className="p-4 border border-[var(--color-border)]">
                <h3 className="font-semibold mb-1">{exhibition.title}</h3>
                <p className="text-sm text-[var(--color-muted-gray)]">{exhibition.location}</p>
                <a
                  href={`/exhibitions/${exhibition.id}`}
                  className="text-sm font-medium underline mt-2 inline-block"
                >
                  View details
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {exhibitions.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--color-muted-gray)]">No locations available.</p>
        </div>
      )}
    </div>
  );
}

