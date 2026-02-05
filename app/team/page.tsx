import Link from 'next/link';
import { teamMemberRepository } from '@/lib/repositories/TeamMemberRepository';
import { initializeDatabase } from '@/lib/db/init';

export default async function TeamPage() {
  await initializeDatabase();
  const members = await teamMemberRepository.findAll();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <header className="mb-16">
        <h1>Team</h1>
        <p className="text-[var(--color-muted-gray)] mt-2">
          Software Engineering Project — Group 7
        </p>
      </header>


      {/* Team List */}
      {members.length > 0 ? (
        <div className="space-y-10">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.slug}`}
              className="block group"
            >
              <article>
                <h2 className="text-xl sm:text-2xl font-semibold group-hover:underline">
                  {member.name}
                </h2>
                {member.role && (
                  <p className="text-sm text-[var(--color-muted-gray)] mt-1">
                    {member.role}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16">
          <p className="text-[var(--color-muted-gray)]">No team members found.</p>
          <p className="text-sm text-[var(--color-muted-gray)] mt-2">
            Add team members to the database to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
