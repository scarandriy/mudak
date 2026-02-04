'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Artwork, User } from '@/lib/types';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';

interface EditArtworkFormProps {
  artwork: Artwork;
  artists?: User[]; // Optional: only provided for organizers
}

export function EditArtworkForm({ artwork, artists }: EditArtworkFormProps) {
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description);
  const [type, setType] = useState(artwork.type);
  const [artistId, setArtistId] = useState(artwork.artistId);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !type || (artists && !artistId)) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = artwork.imageUrl;

      // If a new image is selected, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success || !uploadResult.url) {
          setError(uploadResult.error || 'Failed to upload image. Please try again.');
          setIsLoading(false);
          return;
        }

        imageUrl = uploadResult.url;
      }

      // Update the artwork
      const updateBody: any = {
        title,
        description,
        type,
        imageUrl,
      };

      // Only include artistId if artists list is provided (organizer editing)
      if (artists && artistId) {
        updateBody.artistId = artistId;
      }

      const response = await fetch(`/api/artworks/${artwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateBody),
      });

      const result = await response.json();
      
      if (result.success) {
        // Redirect based on current path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/organizer/')) {
          router.push('/organizer/artworks');
        } else {
          router.push('/artist/artworks');
        }
        router.refresh();
      } else {
        setError(result.error || 'Failed to update artwork. Please try again.');
      }
    } catch (err) {
      setError('Failed to update artwork. Please try again.');
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

      {artists && artists.length > 0 && (
        <Select
          label="Artist"
          options={[
            { value: '', label: 'Select artist' },
            ...artists.map(artist => ({ value: artist.id, label: artist.name })),
          ]}
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          required
        />
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

      <Select
        label="Type"
        options={[
          { value: '', label: 'Select type' },
          { value: 'Photography', label: 'Photography' },
          { value: 'Painting', label: 'Painting' },
          { value: 'Sculpture', label: 'Sculpture' },
          { value: 'Installation', label: 'Installation' },
          { value: 'Video', label: 'Video' },
          { value: 'Mixed Media', label: 'Mixed Media' },
        ]}
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Image</label>
        {artwork.imageUrl && (
          <div className="mb-2">
            <p className="text-xs text-[var(--color-muted-gray)] mb-2">Current image:</p>
            <img src={artwork.imageUrl} alt={artwork.title} className="max-w-xs h-32 object-cover border border-black" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="px-4 py-3 border border-black bg-white text-black focus:outline-none"
        />
        <p className="text-xs text-[var(--color-muted-gray)]">Upload a new image (optional - leave empty to keep current)</p>
      </div>

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

