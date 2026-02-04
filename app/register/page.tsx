'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PageHeader } from '@/shared/components/PageHeader';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('visitor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await register(email, password, name, role);
      if (result.success && result.user) {
        // Cookie is set by the API route, no need to set it here
        
        // Redirect based on role
        if (result.user.role === 'artist') {
          router.push('/artist');
        } else if (result.user.role === 'organizer') {
          router.push('/organizer');
        } else if (result.user.role === 'visitor') {
          router.push('/me');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-8 py-12">
      <PageHeader title="Register" subtitle="Create a new account" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 border border-red-600 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={6}
        />

        <Select
          label="Role"
          options={[
            { value: 'visitor', label: 'Visitor' },
            { value: 'artist', label: 'Artist' },
            { value: 'organizer', label: 'Organizer' },
          ]}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          required
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

        <div className="text-center text-sm text-[var(--color-muted-gray)]">
          Already have an account?{' '}
          <a href="/login" className="font-medium underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}

