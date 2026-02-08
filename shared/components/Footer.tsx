import Link from 'next/link';

export function Footer() {
  const teamMembers = [
    { name: 'Andrii Shramenko', slug: 'andrii-shramenko' },
    { name: 'Dmytro Shapiro', slug: 'dmytro-shapiro' },
    { name: 'Vitalii Krivkov', slug: 'vitalii-krivkov' },
    { name: 'Yaroslav Zabolotskyi', slug: 'yaroslav-zabolotskyi' },
    { name: 'Yaroslav Muzalevskyi', slug: 'yaroslav-muzalevskyi' },
    { name: 'Giorgos Kotsias', slug: 'giorgos-kotsias' },
  ];

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/artworks', label: 'Artworks' },
    { href: '/exhibitions', label: 'Exhibitions' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/map', label: 'Map' },
  ];

  return (
    <footer className="pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight">
              MUDΛK
            </Link>
            <p className="mt-4 text-sm text-[var(--color-muted-gray)]">
              Software Engineering Project
            </p>
            <p className="text-sm text-[var(--color-muted-gray)]">
              Group 7
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted-gray)] hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              <Link href="/team" className="hover:underline">
                Team
              </Link>
            </h4>
            <ul className="space-y-1">
              {teamMembers.map((member) => (
                <li key={member.slug}>
                  <Link
                    href={`/team/${member.slug}`}
                    className="text-sm text-[var(--color-muted-gray)] hover:text-black transition-colors"
                  >
                    {member.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted-gray)]">
            © {new Date().getFullYear()} MUDΛK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
