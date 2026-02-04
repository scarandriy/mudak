'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';

export function Navigation() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, logout, isLoading } = auth;

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              MUDΛK
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium ${isActive('/') ? 'underline' : ''}`}
              >
                Home
              </Link>
              <Link
                href="/artworks"
                className={`text-sm font-medium ${isActive('/artworks') ? 'underline' : ''}`}
              >
                Artworks
              </Link>
              <Link
                href="/exhibitions"
                className={`text-sm font-medium ${isActive('/exhibitions') ? 'underline' : ''}`}
              >
                Exhibitions
              </Link>
              <Link
                href="/calendar"
                className={`text-sm font-medium ${isActive('/calendar') ? 'underline' : ''}`}
              >
                Calendar
              </Link>
              <Link
                href="/map"
                className={`text-sm font-medium ${isActive('/map') ? 'underline' : ''}`}
              >
                Map
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {isLoading ? (
              <span className="text-sm text-[var(--color-muted-gray)]">Loading...</span>
            ) : user ? (
              <>
                {user.role === 'artist' && (
                  <Link href="/artist" className="text-sm font-medium">
                    Artist
                  </Link>
                )}
                {user.role === 'organizer' && (
                  <Link href="/organizer" className="text-sm font-medium">
                    Organizer
                  </Link>
                )}
                {user.role === 'visitor' && (
                  <Link href="/me" className="text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <span className="text-sm text-[var(--color-muted-gray)]">{user.name}</span>
                <button onClick={logout} className="text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

