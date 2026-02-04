'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PageHeader } from '@/shared/components/PageHeader';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        // Cookie is set by the API route, no need to set it here
        
        // Redirect based on role
        if (result.user.role === 'artist') {
          router.push('/artist');
        } else if (result.user.role === 'organizer') {
          router.push('/organizer');
        } else if (result.user.role === 'visitor') {
          router.push('/me');
        } else if (result.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-8 py-12">
      <PageHeader title="Login" subtitle="Sign in to your account" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 border border-red-600 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
          autoComplete="current-password"
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center text-sm text-[var(--color-muted-gray)]">
          Don't have an account?{' '}
          <a href="/register" className="font-medium underline">
            Register
          </a>
        </div>
      </form>

      <div className="mt-8 p-4">
        <p className="text-xs font-semibold mb-2">Test Accounts:</p>
        <ul className="text-xs text-[var(--color-muted-gray)] space-y-1">
          <li>artist@example.com / any password</li>
          <li>organizer@example.com / any password</li>
          <li>visitor@example.com / any password</li>
        </ul>
      </div>
    </div>
  );
}

