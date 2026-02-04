'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';

interface VerifyExhibitionButtonProps {
  exhibitionId: string;
  isVerified: boolean;
}

export function VerifyExhibitionButton({ exhibitionId, isVerified }: VerifyExhibitionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/exhibitions/${exhibitionId}/verify`, {
        method: 'PATCH',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert(`Failed to verify exhibition: ${result.error || 'Unknown error'}`);
      }
    } catch {
      alert('An error occurred while verifying the exhibition.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return null;
  }

  return (
    <Button
      onClick={handleVerify}
      variant="secondary"
      disabled={isLoading}
    >
      {isLoading ? 'Verifying...' : 'Verify'}
    </Button>
  );
}


