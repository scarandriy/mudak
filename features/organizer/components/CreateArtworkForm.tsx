'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';

interface CreateArtworkFormProps {
  artists: User[];
}

export function CreateArtworkForm({ artists }: CreateArtworkFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [artistId, setArtistId] = useState(artists.length > 0 ? artists[0].id : '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !type || !artistId) {
      setError('Please fill in all required fields');
      return;
    }

    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    setIsLoading(true);

    try {
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

      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          artistId,
          title,
          description,
          type,
          imageUrl: uploadResult.url,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push('/organizer/artworks');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create artwork. Please try again.');
      }
    } catch (err) {
      setError('Failed to create artwork. Please try again.');
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="px-4 py-3 border border-black bg-white text-black focus:outline-none"
        />
        <p className="text-xs text-[var(--color-muted-gray)]">Upload an image of the artwork</p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Artwork'}
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

