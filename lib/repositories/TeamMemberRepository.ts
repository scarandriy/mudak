import 'server-only';
import { query } from '@/lib/db/connection';
import { TeamMember } from '@/lib/types';

export class TeamMemberRepository {
  async findAll(): Promise<TeamMember[]> {
    const result = await query<{
      id: string;
      name: string;
      slug: string;
      role: string | null;
      bio: string | null;
      contributions: string | null;
      github: string | null;
      linkedin: string | null;
      email: string | null;
      image_url: string | null;
      created_at: Date;
      updated_at: Date;
    }>(`
      SELECT id, name, slug, role, bio, contributions, github, linkedin, email, image_url, created_at, updated_at
      FROM team_members
      ORDER BY name ASC
    `);

    return result.rows.map(this.mapRowToTeamMember);
  }

  async findBySlug(slug: string): Promise<TeamMember | null> {
    const result = await query<{
      id: string;
      name: string;
      slug: string;
      role: string | null;
      bio: string | null;
      contributions: string | null;
      github: string | null;
      linkedin: string | null;
      email: string | null;
      image_url: string | null;
      created_at: Date;
      updated_at: Date;
    }>(`
      SELECT id, name, slug, role, bio, contributions, github, linkedin, email, image_url, created_at, updated_at
      FROM team_members
      WHERE slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToTeamMember(result.rows[0]);
  }

  async findById(id: string): Promise<TeamMember | null> {
    const result = await query<{
      id: string;
      name: string;
      slug: string;
      role: string | null;
      bio: string | null;
      contributions: string | null;
      github: string | null;
      linkedin: string | null;
      email: string | null;
      image_url: string | null;
      created_at: Date;
      updated_at: Date;
    }>(`
      SELECT id, name, slug, role, bio, contributions, github, linkedin, email, image_url, created_at, updated_at
      FROM team_members
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToTeamMember(result.rows[0]);
  }

  private mapRowToTeamMember(row: {
    id: string;
    name: string;
    slug: string;
    role: string | null;
    bio: string | null;
    contributions: string | null;
    github: string | null;
    linkedin: string | null;
    email: string | null;
    image_url: string | null;
    created_at: Date;
    updated_at: Date;
  }): TeamMember {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      role: row.role || undefined,
      bio: row.bio || undefined,
      contributions: row.contributions || undefined,
      github: row.github || undefined,
      linkedin: row.linkedin || undefined,
      email: row.email || undefined,
      imageUrl: row.image_url || undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

export const teamMemberRepository = new TeamMemberRepository();
