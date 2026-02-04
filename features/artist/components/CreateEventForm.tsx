'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Artwork } from '@/lib/types';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Button } from '@/shared/ui/Button';

interface CreateEventFormProps {
  organizerId: string;
  organizerName: string;
  artworks: Artwork[];
}

export function CreateEventForm({ organizerId, organizerName: _organizerName, artworks }: CreateEventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !startDate || !endDate || !location) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          organizerId,
          title,
          description,
          startDate,
          endDate,
          location,
          isVisible,
          capacity: capacity ? parseInt(capacity, 10) : undefined,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.exhibition) {
        // Assign selected artworks
        if (selectedArtworks.length > 0) {
          await Promise.all(
            selectedArtworks.map(artworkId =>
              fetch(`/api/exhibitions/${result.exhibition.id}/artworks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ artworkId }),
              })
            )
          );
        }
        
        router.push('/artist/events');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create event. Please try again.');
      }
    } catch (_err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 border border-red-600 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <Input
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <Input
        label="Number of Participants"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        min="1"
        placeholder="Optional - leave empty for unlimited"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isVisible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="isVisible" className="text-sm font-medium">
          Make visible to public
        </label>
      </div>

      {artworks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Artworks</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto border border-black p-4">
            {artworks.map(artwork => (
              <div key={artwork.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`artwork-${artwork.id}`}
                  checked={selectedArtworks.includes(artwork.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedArtworks([...selectedArtworks, artwork.id]);
                    } else {
                      setSelectedArtworks(selectedArtworks.filter(id => id !== artwork.id));
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor={`artwork-${artwork.id}`} className="text-sm cursor-pointer">
                  {artwork.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Event'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

