'use client';

import dynamic from 'next/dynamic';

interface MapLocation {
  id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface MapWrapperProps {
  locations: MapLocation[];
  className?: string;
}

const ExhibitionMap = dynamic(
  () => import('@/shared/components/Map').then((mod) => mod.ExhibitionMap),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[4/3] bg-[var(--color-light-gray)] flex items-center justify-center">
        <p className="text-[var(--color-muted-gray)]">Loading map...</p>
      </div>
    ),
  }
);

export function MapWrapper({ locations, className }: MapWrapperProps) {
  return <ExhibitionMap locations={locations} className={className} />;
}
