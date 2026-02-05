'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';

export function Navigation() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, logout, isLoading } = auth;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/artworks', label: 'Artworks' },
    { href: '/exhibitions', label: 'Exhibitions' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/map', label: 'Map' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo + Desktop Navigation */}
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight">
              MUDΛK
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${isActive(link.href) ? 'underline' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`text-sm font-medium py-2 ${isActive(link.href) ? 'underline' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              {isLoading ? (
                <span className="text-sm text-[var(--color-muted-gray)]">Loading...</span>
              ) : user ? (
                <>
                  {user.role === 'artist' && (
                    <Link href="/artist" onClick={closeMobileMenu} className="text-sm font-medium py-2">
                      Artist Dashboard
                    </Link>
                  )}
                  {user.role === 'organizer' && (
                    <Link href="/organizer" onClick={closeMobileMenu} className="text-sm font-medium py-2">
                      Organizer Dashboard
                    </Link>
                  )}
                  {user.role === 'visitor' && (
                    <Link href="/me" onClick={closeMobileMenu} className="text-sm font-medium py-2">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={closeMobileMenu} className="text-sm font-medium py-2">
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-[var(--color-muted-gray)]">{user.name}</span>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/login" onClick={closeMobileMenu} className="text-sm font-medium py-2">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

