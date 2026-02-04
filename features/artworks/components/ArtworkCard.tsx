import Link from 'next/link';
import Image from 'next/image';
import { Artwork } from '@/lib/types';

interface ArtworkCardProps {
  artwork: Artwork;
  compact?: boolean;
}

export function ArtworkCard({ artwork, compact = false }: ArtworkCardProps) {
  if (compact) {
    return (
      <div className="block group">
        <Link href={`/artworks/${artwork.id}`}>
          <div className="mb-3 aspect-square relative bg-[var(--color-light-gray)] overflow-hidden">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover group-hover:opacity-90 transition-opacity"
              unoptimized
            />
          </div>
          <h3 className="text-sm font-semibold mb-1">{artwork.title}</h3>
        </Link>
        <Link 
          href={`/artists/${artwork.artistId}`}
          className="text-xs text-[var(--color-muted-gray)] hover:underline"
        >
          {artwork.artistName}
        </Link>
      </div>
    );
  }

  return (
    <div className="block group">
      <Link href={`/artworks/${artwork.id}`}>
        <div className="mb-4 aspect-[4/3] relative bg-[var(--color-light-gray)] overflow-hidden">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
      </Link>
      <Link 
        href={`/artists/${artwork.artistId}`}
        className="text-sm text-[var(--color-muted-gray)] mb-2 hover:underline block"
      >
        {artwork.artistName}
      </Link>
      <p className="text-sm text-[var(--color-muted-gray)]">{artwork.type}</p>
    </div>
  );
}

