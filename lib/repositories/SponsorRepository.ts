import 'server-only';
import { query } from '@/lib/db/connection';
import { Sponsor } from '@/lib/types';

export class SponsorRepository {
  async findByExhibition(exhibitionId: string): Promise<Sponsor[]> {
    const result = await query<{
      id: string;
      name: string;
      logo_url: string | null;
      exhibition_id: string;
    }>(
      `SELECT id, name, logo_url, exhibition_id
       FROM sponsors
       WHERE exhibition_id = $1
       ORDER BY name`,
      [exhibitionId]
    );

    return result.rows.map(this.mapRowToSponsor);
  }

  async create(exhibitionId: string, name: string, logoUrl?: string): Promise<Sponsor> {
    const result = await query<{ id: string }>(
      `INSERT INTO sponsors (name, logo_url, exhibition_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name, logoUrl || null, exhibitionId]
    );

    return {
      id: result.rows[0].id,
      name,
      logoUrl,
      exhibitionId,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM sponsors WHERE id = $1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  private mapRowToSponsor(row: {
    id: string;
    name: string;
    logo_url: string | null;
    exhibition_id: string;
  }): Sponsor {
    return {
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url || undefined,
      exhibitionId: row.exhibition_id,
    };
  }
}

export const sponsorRepository = new SponsorRepository();

