'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';

interface DeleteArtworkButtonProps {
  artworkId: string;
  artworkTitle: string;
}

export function DeleteArtworkButton({ artworkId, artworkTitle: _artworkTitle }: DeleteArtworkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert('Failed to delete artwork');
      }
    } catch (_error) {
      alert('Failed to delete artwork');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="text-xs py-1 px-3"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Confirm'}
        </Button>
        <Button
          variant="text"
          className="text-xs py-1 px-3"
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="text"
      className="text-xs py-1 px-3 text-red-600"
      onClick={() => setShowConfirm(true)}
    >
      Delete
    </Button>
  );
}

