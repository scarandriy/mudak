import Link from 'next/link';
import { Exhibition } from '@/lib/types';
import { Badge } from '@/shared/ui/Badge';

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  const startDate = new Date(exhibition.startDate);
  const endDate = new Date(exhibition.endDate);
  const isUpcoming = startDate > new Date();
  const isOngoing = startDate <= new Date() && endDate >= new Date();

  return (
    <Link href={`/exhibitions/${exhibition.id}`} className="block group">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold group-hover:underline">{exhibition.title}</h3>
          {isUpcoming && <Badge>Upcoming</Badge>}
          {isOngoing && <Badge variant="success">Ongoing</Badge>}
        </div>
        <p className="text-sm text-[var(--color-muted-gray)] mb-3">
          {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-[var(--color-muted-gray)] mb-3">{exhibition.location}</p>
        <p className="text-sm line-clamp-3">{exhibition.description}</p>
      </div>
    </Link>
  );
}

