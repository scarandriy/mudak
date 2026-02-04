import 'server-only';
import { query } from '@/lib/db/connection';
import { Registration } from '@/lib/types';

export class RegistrationRepository {
  async findByUser(userId: string): Promise<Registration[]> {
    const result = await query<{
      id: string;
      exhibition_id: string;
      exhibition_title: string;
      user_id: string;
      user_name: string;
      status: string;
      registered_at: Date;
    }>(
      `SELECT r.id, r.exhibition_id, e.title as exhibition_title,
              r.user_id, u.name as user_name, r.status, r.registered_at
       FROM registrations r
       JOIN exhibitions e ON r.exhibition_id = e.id
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1
       ORDER BY r.registered_at DESC`,
      [userId]
    );

    return result.rows.map(this.mapRowToRegistration);
  }

  async findByExhibition(exhibitionId: string): Promise<Registration[]> {
    const result = await query<{
      id: string;
      exhibition_id: string;
      exhibition_title: string;
      user_id: string;
      user_name: string;
      status: string;
      registered_at: Date;
    }>(
      `SELECT r.id, r.exhibition_id, e.title as exhibition_title,
              r.user_id, u.name as user_name, r.status, r.registered_at
       FROM registrations r
       JOIN exhibitions e ON r.exhibition_id = e.id
       JOIN users u ON r.user_id = u.id
       WHERE r.exhibition_id = $1
       ORDER BY r.registered_at DESC`,
      [exhibitionId]
    );

    return result.rows.map(this.mapRowToRegistration);
  }

  async findByUserAndExhibition(userId: string, exhibitionId: string): Promise<Registration | null> {
    const result = await query<{
      id: string;
      exhibition_id: string;
      exhibition_title: string;
      user_id: string;
      user_name: string;
      status: string;
      registered_at: Date;
    }>(
      `SELECT r.id, r.exhibition_id, e.title as exhibition_title,
              r.user_id, u.name as user_name, r.status, r.registered_at
       FROM registrations r
       JOIN exhibitions e ON r.exhibition_id = e.id
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = $1 AND r.exhibition_id = $2
       LIMIT 1`,
      [userId, exhibitionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRegistration(result.rows[0]);
  }

  async create(exhibitionId: string, userId: string, status: 'confirmed'): Promise<Registration> {
    const exhibitionResult = await query<{ title: string }>(
      `SELECT title FROM exhibitions WHERE id = $1`,
      [exhibitionId]
    );

    if (exhibitionResult.rows.length === 0) {
      throw new Error('Exhibition not found');
    }

    const userResult = await query<{ name: string }>(
      `SELECT name FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const result = await query<{ id: string; registered_at: Date }>(
      `INSERT INTO registrations (exhibition_id, user_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (exhibition_id, user_id) DO UPDATE
       SET status = EXCLUDED.status, registered_at = CURRENT_TIMESTAMP
       RETURNING id, registered_at`,
      [exhibitionId, userId, status]
    );

    return {
      id: result.rows[0].id,
      exhibitionId,
      exhibitionTitle: exhibitionResult.rows[0].title,
      userId,
      userName: userResult.rows[0].name,
      status,
      registeredAt: result.rows[0].registered_at.toISOString(),
    };
  }

  async findById(id: string): Promise<Registration | null> {
    const result = await query<{
      id: string;
      exhibition_id: string;
      exhibition_title: string;
      user_id: string;
      user_name: string;
      status: string;
      registered_at: Date;
    }>(
      `SELECT r.id, r.exhibition_id, e.title as exhibition_title,
              r.user_id, u.name as user_name, r.status, r.registered_at
       FROM registrations r
       JOIN exhibitions e ON r.exhibition_id = e.id
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1
       LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRegistration(result.rows[0]);
  }

  async updateStatus(id: string, status: 'confirmed'): Promise<Registration | null> {
    const updateResult = await query(
      `UPDATE registrations SET status = $2 WHERE id = $1`,
      [id, status]
    );

    if (updateResult.rowCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM registrations WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  private mapRowToRegistration(row: {
    id: string;
    exhibition_id: string;
    exhibition_title: string;
    user_id: string;
    user_name: string;
    status: string;
    registered_at: Date;
  }): Registration {
    return {
      id: row.id,
      exhibitionId: row.exhibition_id,
      exhibitionTitle: row.exhibition_title,
      userId: row.user_id,
      userName: row.user_name,
      status: 'confirmed',
      registeredAt: row.registered_at.toISOString(),
    };
  }
}

export const registrationRepository = new RegistrationRepository();

