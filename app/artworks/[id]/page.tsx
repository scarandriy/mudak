import { getArtworkById } from '@/lib/data/api';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/shared/components/PageHeader';
import Image from 'next/image';
import Link from 'next/link';

interface ArtworkDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <PageHeader
        title={artwork.title}
        subtitle={
          <Link 
            href={`/artists/${artwork.artistId}`}
            className="hover:underline"
          >
            {artwork.artistName}
          </Link>
        }
        metadata={
          <div className="flex gap-4 text-sm">
            <span>{artwork.type}</span>
            <span className="text-[var(--color-muted-gray)]">
              {new Date(artwork.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div className="relative aspect-[4/3] bg-[var(--color-light-gray)]">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Description</h3>
          <p className="text-base leading-relaxed whitespace-pre-line">{artwork.description}</p>
        </div>
      </div>
    </div>
  );
}

