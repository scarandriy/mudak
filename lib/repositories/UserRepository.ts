import 'server-only';
import { query } from '@/lib/db/connection';
import { User, UserRole } from '@/lib/types';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
      bio: string | null;
      contact: string | null;
      website: string | null;
      instagram: string | null;
      twitter: string | null;
    }>(
      `SELECT u.id, u.email, u.name, u.role, u.bio, u.contact,
              asl.website, asl.instagram, asl.twitter
       FROM users u
       LEFT JOIN artist_social_links asl ON u.id = asl.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToUser(row);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
      bio: string | null;
      contact: string | null;
      website: string | null;
      instagram: string | null;
      twitter: string | null;
    }>(
      `SELECT u.id, u.email, u.name, u.role, u.bio, u.contact,
              asl.website, asl.instagram, asl.twitter
       FROM users u
       LEFT JOIN artist_social_links asl ON u.id = asl.user_id
       WHERE u.role = $1
       ORDER BY u.name`,
      [role]
    );

    return result.rows.map(this.mapRowToUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
      bio: string | null;
      contact: string | null;
      website: string | null;
      instagram: string | null;
      twitter: string | null;
    }>(
      `SELECT u.id, u.email, u.name, u.role, u.bio, u.contact,
              asl.website, asl.instagram, asl.twitter
       FROM users u
       LEFT JOIN artist_social_links asl ON u.id = asl.user_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToUser(row);
  }

  async findByEmailWithPassword(email: string): Promise<{ user: User; passwordHash: string } | null> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: UserRole;
      password_hash: string;
      bio: string | null;
      contact: string | null;
      website: string | null;
      instagram: string | null;
      twitter: string | null;
    }>(
      `SELECT u.id, u.email, u.name, u.role, u.password_hash, u.bio, u.contact,
              asl.website, asl.instagram, asl.twitter
       FROM users u
       LEFT JOIN artist_social_links asl ON u.id = asl.user_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      user: this.mapRowToUser(row),
      passwordHash: row.password_hash,
    };
  }

  async create(
    email: string,
    name: string,
    role: UserRole,
    passwordHash: string,
    bio?: string,
    contact?: string
  ): Promise<User> {
    const result = await query<{ id: string }>(
      `INSERT INTO users (email, name, role, password_hash, bio, contact)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [email, name, role, passwordHash, bio || null, contact || null]
    );

    const userId = result.rows[0].id;
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }
    return user;
  }

  async update(
    id: string,
    updates: {
      name?: string;
      bio?: string;
      contact?: string;
      socialLinks?: {
        website?: string;
        instagram?: string;
        twitter?: string;
      };
    }
  ): Promise<User> {
    if ('name' in updates || 'bio' in updates || 'contact' in updates) {
      const updateFields: string[] = [];
      const values: (string | null)[] = [];
      let paramIndex = 1;

      if ('name' in updates) {
        updateFields.push(`name = $${paramIndex}`);
        values.push(updates.name || null);
        paramIndex++;
      }
      if ('bio' in updates) {
        updateFields.push(`bio = $${paramIndex}`);
        values.push(updates.bio || null);
        paramIndex++;
      }
      if ('contact' in updates) {
        updateFields.push(`contact = $${paramIndex}`);
        values.push(updates.contact || null);
        paramIndex++;
      }

      values.push(id);
      await query(
        `UPDATE users
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramIndex}`,
        values
      );
    }

    if (updates.socialLinks) {
      await query(
        `INSERT INTO artist_social_links (user_id, website, instagram, twitter)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id)
         DO UPDATE SET
           website = COALESCE(EXCLUDED.website, artist_social_links.website),
           instagram = COALESCE(EXCLUDED.instagram, artist_social_links.instagram),
           twitter = COALESCE(EXCLUDED.twitter, artist_social_links.twitter),
           updated_at = CURRENT_TIMESTAMP`,
        [id, updates.socialLinks.website || null, updates.socialLinks.instagram || null, updates.socialLinks.twitter || null]
      );
    }

    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found after update');
    }
    return user;
  }

  private mapRowToUser(row: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    bio: string | null;
    contact: string | null;
    website: string | null;
    instagram: string | null;
    twitter: string | null;
  }): User {
    const user: User = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
    };

    if (row.bio) user.bio = row.bio;
    if (row.contact) user.contact = row.contact;

    if (row.website || row.instagram || row.twitter) {
      user.socialLinks = {};
      if (row.website) user.socialLinks.website = row.website;
      if (row.instagram) user.socialLinks.instagram = row.instagram;
      if (row.twitter) user.socialLinks.twitter = row.twitter;
    }

    return user;
  }
}

export const userRepository = new UserRepository();

