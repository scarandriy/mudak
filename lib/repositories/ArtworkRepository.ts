import 'server-only';
import { query } from '@/lib/db/connection';
import { Artwork } from '@/lib/types';

export class ArtworkRepository {
  async findAll(filters?: { artistId?: string; type?: string }, sort?: 'recent' | 'popular'): Promise<Artwork[]> {
    let sql = `
      SELECT a.id, a.title, a.description, a.type, a.image_url, a.artist_id,
             u.name as artist_name, a.created_at, a.updated_at
      FROM artworks a
      JOIN users u ON a.artist_id = u.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (filters?.artistId) {
      sql += ` AND a.artist_id = $${paramIndex++}`;
      params.push(filters.artistId);
    }

    if (filters?.type) {
      sql += ` AND a.type = $${paramIndex++}`;
      params.push(filters.type);
    }

    if (sort === 'recent') {
      sql += ` ORDER BY a.created_at DESC`;
    } else if (sort === 'popular') {
      sql += ` ORDER BY a.created_at ASC`;
    } else {
      sql += ` ORDER BY a.created_at DESC`;
    }

    const result = await query<{
      id: string;
      title: string;
      description: string;
      type: string;
      image_url: string;
      artist_id: string;
      artist_name: string;
      created_at: Date;
      updated_at: Date;
    }>(sql, params);

    return result.rows.map(this.mapRowToArtwork);
  }

  async findById(id: string): Promise<Artwork | null> {
    const result = await query<{
      id: string;
      title: string;
      description: string;
      type: string;
      image_url: string;
      artist_id: string;
      artist_name: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT a.id, a.title, a.description, a.type, a.image_url, a.artist_id,
              u.name as artist_name, a.created_at, a.updated_at
       FROM artworks a
       JOIN users u ON a.artist_id = u.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToArtwork(result.rows[0]);
  }

  async findByArtist(artistId: string): Promise<Artwork[]> {
    return this.findAll({ artistId });
  }

  async create(
    artistId: string,
    title: string,
    description: string,
    type: string,
    imageUrl: string
  ): Promise<Artwork> {
    const result = await query<{ id: string }>(
      `INSERT INTO artworks (title, description, type, image_url, artist_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [title, description, type, imageUrl, artistId]
    );

    const artworkId = result.rows[0].id;
    const artwork = await this.findById(artworkId);
    if (!artwork) {
      throw new Error('Failed to create artwork');
    }
    return artwork;
  }

  async update(
    id: string,
    updates: Partial<Pick<Artwork, 'title' | 'description' | 'type' | 'imageUrl' | 'artistId'>>
  ): Promise<Artwork> {
    const updateFields: string[] = [];
    const values: (string | null)[] = [];
    let paramIndex = 1;

    if ('title' in updates) {
      updateFields.push(`title = $${paramIndex++}`);
      values.push(updates.title || null);
    }
    if ('description' in updates) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(updates.description || null);
    }
    if ('type' in updates) {
      updateFields.push(`type = $${paramIndex++}`);
      values.push(updates.type || null);
    }
    if ('imageUrl' in updates) {
      updateFields.push(`image_url = $${paramIndex++}`);
      values.push(updates.imageUrl || null);
    }
    if ('artistId' in updates && updates.artistId) {
      updateFields.push(`artist_id = $${paramIndex++}`);
      values.push(updates.artistId);
    }

    values.push(id);
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    await query(
      `UPDATE artworks
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}`,
      values
    );

    const artwork = await this.findById(id);
    if (!artwork) {
      throw new Error('Artwork not found after update');
    }
    return artwork;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM artworks WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  private mapRowToArtwork(row: {
    id: string;
    title: string;
    description: string;
    type: string;
    image_url: string;
    artist_id: string;
    artist_name: string;
    created_at: Date;
    updated_at: Date;
  }): Artwork {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      imageUrl: row.image_url,
      artistId: row.artist_id,
      artistName: row.artist_name,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

export const artworkRepository = new ArtworkRepository();

