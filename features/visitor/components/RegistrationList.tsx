'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Registration } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { useRouter } from 'next/navigation';

interface RegistrationListProps {
  registrations: Registration[];
}

export function RegistrationList({ registrations }: RegistrationListProps) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    setCancellingId(registrationId);
    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        router.refresh();
      } else {
        alert('Failed to cancel registration');
      }
    } catch (error) {
      alert('Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {registrations.map(registration => (
        <div key={registration.id} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/exhibitions/${registration.exhibitionId}`}>
                <h3 className="text-lg font-semibold mb-2 hover:underline">{registration.exhibitionTitle}</h3>
              </Link>
              <p className="text-sm text-[var(--color-muted-gray)]">
                Your registration has been confirmed.
              </p>
              <p className="text-sm text-[var(--color-muted-gray)] mt-1">
                Registered on {new Date(registration.registeredAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => handleCancel(registration.id)}
              disabled={cancellingId === registration.id}
            >
              {cancellingId === registration.id ? 'Cancelling...' : 'Cancel Registration'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

