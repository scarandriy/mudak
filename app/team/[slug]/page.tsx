import { notFound } from 'next/navigation';
import { teamMemberRepository } from '@/lib/repositories/TeamMemberRepository';
import { initializeDatabase } from '@/lib/db/init';

interface TeamMemberPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  await initializeDatabase();
  const { slug } = await params;
  const member = await teamMemberRepository.findBySlug(slug);

  if (!member) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <header className="mb-16">
        <h1>{member.name}</h1>
        {member.role && (
          <p className="text-[var(--color-muted-gray)] mt-2">
            {member.role}
          </p>
        )}

        {/* Links */}
        {(member.github || member.linkedin || member.email) && (
          <div className="flex gap-6 mt-6">
            {member.github && (
              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                GitHub
              </a>
            )}
            {member.linkedin && (
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                LinkedIn
              </a>
            )}
            {member.email && (
              <a 
                href={`mailto:${member.email}`}
                className="text-sm hover:underline"
              >
                {member.email}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Bio */}
      {member.bio && (
        <section className="mb-16">
          <h2 className="text-sm font-medium uppercase tracking-wider  mb-4">
            About
          </h2>
          <p className="max-w-3xl leading-relaxed whitespace-pre-line">
            {member.bio}
          </p>
        </section>
      )}

      {/* Contributions */}
      {member.contributions && (
        <section className="mb-16">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-4">
            Contributions
          </h2>
          <div className="max-w-3xl whitespace-pre-line leading-relaxed">
            {member.contributions}
          </div>
        </section>
      )}
    </div>
  );
}
