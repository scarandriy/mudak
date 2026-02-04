import 'server-only';
import { query } from '@/lib/db/connection';
import { Exhibition } from '@/lib/types';

export class ExhibitionRepository {
  async findAll(onlyVisible: boolean = false): Promise<Exhibition[]> {
    let sql = `
      SELECT e.id, e.title, e.description, e.start_date, e.end_date, e.location,
             e.is_visible, e.verified, e.verification_feedback, e.organizer_id, u.name as organizer_name,
             e.capacity, e.created_at, e.updated_at
      FROM exhibitions e
      JOIN users u ON e.organizer_id = u.id
    `;
    const params: any[] = [];

    if (onlyVisible) {
      sql += ` WHERE e.is_visible = true AND e.verified = true`;
    }

    sql += ` ORDER BY e.start_date DESC`;

    const result = await query<{
      id: string;
      title: string;
      description: string;
      start_date: Date;
      end_date: Date;
      location: string;
      is_visible: boolean;
      verified: boolean;
      organizer_id: string;
      organizer_name: string;
      capacity: number | null;
      created_at: Date;
      updated_at: Date;
    }>(sql, params);

    const exhibitions = await Promise.all(
      result.rows.map(async (row) => {
        const artworkIds = await this.getArtworkIds(row.id);
        return this.mapRowToExhibition(row, artworkIds);
      })
    );

    return exhibitions;
  }

  async findById(id: string): Promise<Exhibition | null> {
    const result = await query<{
      id: string;
      title: string;
      description: string;
      start_date: Date;
      end_date: Date;
      location: string;
      is_visible: boolean;
      verified: boolean;
      verification_feedback: string | null;
      organizer_id: string;
      organizer_name: string;
      capacity: number | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT e.id, e.title, e.description, e.start_date, e.end_date, e.location,
              e.is_visible, e.verified, e.verification_feedback, e.organizer_id, u.name as organizer_name,
              e.capacity, e.created_at, e.updated_at
       FROM exhibitions e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const artworkIds = await this.getArtworkIds(id);
    return this.mapRowToExhibition(result.rows[0], artworkIds);
  }

  async findByOrganizer(organizerId: string): Promise<Exhibition[]> {
    const result = await query<{
      id: string;
      title: string;
      description: string;
      start_date: Date;
      end_date: Date;
      location: string;
      is_visible: boolean;
      verified: boolean;
      verification_feedback: string | null;
      organizer_id: string;
      organizer_name: string;
      capacity: number | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT e.id, e.title, e.description, e.start_date, e.end_date, e.location,
              e.is_visible, e.verified, e.verification_feedback, e.organizer_id, u.name as organizer_name,
              e.capacity, e.created_at, e.updated_at
       FROM exhibitions e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.organizer_id = $1
       ORDER BY e.start_date DESC`,
      [organizerId]
    );

    const exhibitions = await Promise.all(
      result.rows.map(async (row) => {
        const artworkIds = await this.getArtworkIds(row.id);
        return this.mapRowToExhibition(row, artworkIds);
      })
    );

    return exhibitions;
  }

  async findByArtist(artistId: string): Promise<Exhibition[]> {
    const result = await query<{
      id: string;
      title: string;
      description: string;
      start_date: Date;
      end_date: Date;
      location: string;
      is_visible: boolean;
      verified: boolean;
      verification_feedback: string | null;
      organizer_id: string;
      organizer_name: string;
      capacity: number | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT DISTINCT e.id, e.title, e.description, e.start_date, e.end_date, e.location,
              e.is_visible, e.verified, e.verification_feedback, e.organizer_id, u.name as organizer_name,
              e.capacity, e.created_at, e.updated_at
       FROM exhibitions e
       JOIN users u ON e.organizer_id = u.id
       JOIN exhibitions_artworks ea ON e.id = ea.exhibition_id
       JOIN artworks a ON ea.artwork_id = a.id
       WHERE a.artist_id = $1
       ORDER BY e.start_date DESC`,
      [artistId]
    );

    const exhibitions = await Promise.all(
      result.rows.map(async (row) => {
        const artworkIds = await this.getArtworkIds(row.id);
        return this.mapRowToExhibition(row, artworkIds);
      })
    );

    return exhibitions;
  }

  async create(
    organizerId: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
    location: string,
    isVisible: boolean = false,
    capacity?: number
  ): Promise<Exhibition> {
    const organizerResult = await query<{ name: string }>(
      `SELECT name FROM users WHERE id = $1`,
      [organizerId]
    );

    if (organizerResult.rows.length === 0) {
      throw new Error('Organizer not found');
    }

    const organizerName = organizerResult.rows[0].name;

    const result = await query<{ id: string }>(
      `INSERT INTO exhibitions (title, description, start_date, end_date, location, is_visible, verified, organizer_id, capacity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [title, description, startDate, endDate, location, isVisible, false, organizerId, capacity || null]
    );

    const exhibitionId = result.rows[0].id;
    const exhibition = await this.findById(exhibitionId);
    if (!exhibition) {
      throw new Error('Failed to create exhibition');
    }
    return exhibition;
  }

  async update(
    id: string,
    updates: Partial<Pick<Exhibition, 'title' | 'description' | 'startDate' | 'endDate' | 'location' | 'capacity' | 'isVisible'>>
  ): Promise<Exhibition> {
    await query(
      `UPDATE exhibitions
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           location = COALESCE($5, location),
           capacity = COALESCE($6, capacity),
           is_visible = COALESCE($7, is_visible),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
      [
        updates.title || null,
        updates.description || null,
        updates.startDate || null,
        updates.endDate || null,
        updates.location || null,
        updates.capacity || null,
        updates.isVisible !== undefined ? updates.isVisible : null,
        id,
      ]
    );

    const exhibition = await this.findById(id);
    if (!exhibition) {
      throw new Error('Exhibition not found after update');
    }
    return exhibition;
  }

  async assignArtwork(exhibitionId: string, artworkId: string): Promise<boolean> {
    const result = await query(
      `INSERT INTO exhibitions_artworks (exhibition_id, artwork_id)
       VALUES ($1, $2)
       ON CONFLICT (exhibition_id, artwork_id) DO NOTHING`,
      [exhibitionId, artworkId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async removeArtwork(exhibitionId: string, artworkId: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM exhibitions_artworks
       WHERE exhibition_id = $1 AND artwork_id = $2`,
      [exhibitionId, artworkId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM exhibitions WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  private async getArtworkIds(exhibitionId: string): Promise<string[]> {
    const result = await query<{ artwork_id: string }>(
      `SELECT artwork_id FROM exhibitions_artworks WHERE exhibition_id = $1 ORDER BY created_at`,
      [exhibitionId]
    );
    return result.rows.map((row) => row.artwork_id);
  }

  async verify(id: string, feedback?: string): Promise<Exhibition> {
    await query(
      `UPDATE exhibitions
       SET verified = true, verification_feedback = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id, feedback || null]
    );

    const exhibition = await this.findById(id);
    if (!exhibition) {
      throw new Error('Exhibition not found after verification');
    }
    return exhibition;
  }

  async reject(id: string, feedback?: string): Promise<Exhibition> {
    await query(
      `UPDATE exhibitions
       SET verified = false, verification_feedback = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id, feedback || null]
    );

    const exhibition = await this.findById(id);
    if (!exhibition) {
      throw new Error('Exhibition not found after rejection');
    }
    return exhibition;
  }

  private mapRowToExhibition(
    row: {
      id: string;
      title: string;
      description: string;
      start_date: Date;
      end_date: Date;
      location: string;
      is_visible: boolean;
      verified: boolean;
      verification_feedback: string | null;
      organizer_id: string;
      organizer_name: string;
      capacity: number | null;
      created_at: Date;
      updated_at: Date;
    },
    artworkIds: string[]
  ): Exhibition {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      startDate: row.start_date.toISOString().split('T')[0],
      endDate: row.end_date.toISOString().split('T')[0],
      location: row.location,
      isVisible: row.is_visible,
      verified: row.verified,
      verificationFeedback: row.verification_feedback || undefined,
      organizerId: row.organizer_id,
      organizerName: row.organizer_name,
      artworkIds,
      capacity: row.capacity || undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

export const exhibitionRepository = new ExhibitionRepository();

