'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Exhibition, Artwork } from '@/lib/types';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Button } from '@/shared/ui/Button';

interface EditEventFormProps {
  exhibition: Exhibition;
  artworks: Artwork[];
}

export function EditEventForm({ exhibition, artworks }: EditEventFormProps) {
  const [title, setTitle] = useState(exhibition.title);
  const [description, setDescription] = useState(exhibition.description);
  const [startDate, setStartDate] = useState(exhibition.startDate);
  const [endDate, setEndDate] = useState(exhibition.endDate);
  const [location, setLocation] = useState(exhibition.location);
  const [capacity, setCapacity] = useState(exhibition.capacity?.toString() || '');
  const [isVisible, setIsVisible] = useState(exhibition.isVisible);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>(exhibition.artworkIds || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setSelectedArtworks(exhibition.artworkIds || []);
  }, [exhibition.artworkIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !startDate || !endDate || !location) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/exhibitions/${exhibition.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
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
      
      if (result.success) {
        // Update artwork assignments
        const currentArtworkIds = exhibition.artworkIds || [];
        const toAdd = selectedArtworks.filter(id => !currentArtworkIds.includes(id));
        const toRemove = currentArtworkIds.filter(id => !selectedArtworks.includes(id));

        // Add new artworks
        await Promise.all(
          toAdd.map(artworkId =>
            fetch(`/api/exhibitions/${exhibition.id}/artworks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ artworkId }),
            })
          )
        );

        // Remove artworks
        await Promise.all(
          toRemove.map(artworkId =>
            fetch(`/api/exhibitions/${exhibition.id}/artworks?artworkId=${artworkId}`, {
              method: 'DELETE',
              credentials: 'include',
            })
          )
        );

        // Redirect based on current path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/organizer/')) {
          router.push('/organizer/events');
        } else {
          router.push('/artist/events');
        }
        router.refresh();
      } else {
        setError(result.error || 'Failed to update event. Please try again.');
      }
    } catch (err) {
      setError('Failed to update event. Please try again.');
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
          {isLoading ? 'Saving...' : 'Save Changes'}
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

