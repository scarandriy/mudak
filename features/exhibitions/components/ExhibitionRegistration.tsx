'use client';

import { useState } from 'react';
import { Exhibition, Registration } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ExhibitionRegistrationProps {
  exhibition: Exhibition;
  userId?: string;
  userName?: string;
  existingRegistration?: Registration | null;
  registeredCount?: number;
}

export function ExhibitionRegistration({ exhibition, userId, userName: _userName, existingRegistration, registeredCount = 0 }: ExhibitionRegistrationProps) {
  const isFull = exhibition.capacity != null && registeredCount >= exhibition.capacity;
  const [isLoading, setIsLoading] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [_registrationStatus, setRegistrationStatus] = useState<'confirmed' | null>(existingRegistration?.status || null);
  const [currentRegistration, setCurrentRegistration] = useState<Registration | null>(existingRegistration || null);
  const router = useRouter();

  const handleRegister = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          exhibitionId: exhibition.id,
          userId,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.registration) {
        setRegistrationStatus(result.registration.status);
        setCurrentRegistration(result.registration);
        setStatus('success');
        router.refresh();
      } else {
        setStatus('error');
        alert(result.error || 'Failed to register. Please try again.');
      }
    } catch {
      setStatus('error');
      alert('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!currentRegistration) return;
    
    if (!confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    setIsUnregistering(true);
    
    try {
      const response = await fetch(`/api/registrations/${currentRegistration.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentRegistration(null);
        setRegistrationStatus(null);
        setStatus('idle');
        router.refresh();
      } else {
        alert('Failed to cancel registration. Please try again.');
      }
    } catch {
      alert('Failed to cancel registration. Please try again.');
    } finally {
      setIsUnregistering(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!userId) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold mb-2">Register for this exhibition</p>
            <p className="text-sm text-[var(--color-muted-gray)]">Log in to register for this event.</p>
          </div>
          <Link href="/login">
            <Button disabled={false} className="opacity-100">
              Log in to Register
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          {currentRegistration ? (
            <>
              <p className="text-sm font-semibold mb-2">Registration confirmed</p>
              <p className="text-sm text-[var(--color-muted-gray)]">
                Your registration has been confirmed.
              </p>
              <p className="text-sm text-[var(--color-muted-gray)] mt-1">
                Registered on {new Date(currentRegistration.registeredAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </>
          ) : isFull ? (
            <p className="text-sm text-[var(--color-muted-gray)]">Event is full. No spots available.</p>
          ) : (
            <>
              <p className="text-sm font-semibold mb-2">Register for this exhibition</p>
              <p className="text-sm text-[var(--color-muted-gray)]">Register when there are free spots.</p>
            </>
          )}
        </div>
        {currentRegistration ? (
          <Button
            variant="secondary"
            onClick={handleUnregister}
            disabled={isUnregistering}
          >
            {isUnregistering ? 'Cancelling...' : 'Cancel Registration'}
          </Button>
        ) : !isFull ? (
          <Button onClick={handleRegister} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Register'}
          </Button>
        ) : null}
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600 mt-4">An error occurred. Please try again.</p>
      )}
    </div>
  );
}

