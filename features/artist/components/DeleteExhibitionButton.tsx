'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';

interface DeleteExhibitionButtonProps {
  exhibitionId: string;
  exhibitionTitle: string;
}

export function DeleteExhibitionButton({ exhibitionId, exhibitionTitle }: DeleteExhibitionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/exhibitions/${exhibitionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        // Redirect based on current path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/organizer/')) {
          router.push('/organizer/events');
        } else {
          router.push('/artist/events');
        }
        router.refresh();
      } else {
        alert('Failed to delete exhibition');
      }
    } catch (error) {
      alert('Failed to delete exhibition');
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

