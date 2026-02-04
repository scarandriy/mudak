import { getExhibitions } from '@/lib/data/api';
import { PageHeader } from '@/shared/components/PageHeader';
import { ExhibitionCard } from '@/features/exhibitions/components/ExhibitionCard';

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions(true);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader title="Exhibitions" subtitle="Current and upcoming exhibitions" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exhibitions.map(exhibition => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>

      {exhibitions.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--color-muted-gray)]">No exhibitions available.</p>
        </div>
      )}
    </div>
  );
}

