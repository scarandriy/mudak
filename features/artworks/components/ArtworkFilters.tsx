'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/shared/ui/Select';

export function ArtworkFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/artworks?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 items-end mb-12">
      <div className="flex-1 max-w-xs">
        <Select
          label="Type"
          options={[
            { value: '', label: 'All Types' },
            { value: 'Photography', label: 'Photography' },
            { value: 'Painting', label: 'Painting' },
            { value: 'Sculpture', label: 'Sculpture' },
            { value: 'Installation', label: 'Installation' },
            { value: 'Video', label: 'Video' },
          ]}
          value={searchParams.get('type') || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        />
      </div>
      <div className="flex-1 max-w-xs">
        <Select
          label="Sort"
          options={[
            { value: 'recent', label: 'Recent' },
            { value: 'popular', label: 'Popular' },
          ]}
          value={searchParams.get('sort') || 'recent'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        />
      </div>
    </div>
  );
}

