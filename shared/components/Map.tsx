'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in webpack/next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapLocation {
  id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface ExhibitionMapProps {
  locations: MapLocation[];
  className?: string;
}

export function ExhibitionMap({ locations, className = '' }: ExhibitionMapProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // Calculate center from locations or default to a central position
  const center = locations.length > 0
    ? {
        lat: locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
        lng: locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length,
      }
    : { lat: 51.505, lng: -0.09 }; // Default to London

  // Calculate appropriate zoom based on locations spread
  const defaultZoom = locations.length > 0 ? 10 : 4;

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold mb-1">{location.title}</h3>
                <p className="text-gray-600 mb-2">{location.location}</p>
                <Link
                  href={`/exhibitions/${location.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
