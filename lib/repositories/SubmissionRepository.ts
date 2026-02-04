import 'server-only';
import { query } from '@/lib/db/connection';
import { Submission } from '@/lib/types';
import { artworkRepository } from './ArtworkRepository';

export class SubmissionRepository {
  async findByExhibition(exhibitionId: string): Promise<Submission[]> {
    const result = await query<{
      id: string;
      artwork_id: string;
      exhibition_id: string;
      status: string;
      feedback: string | null;
      submitted_at: Date;
    }>(
      `SELECT id, artwork_id, exhibition_id, status, feedback, submitted_at
       FROM submissions
       WHERE exhibition_id = $1
       ORDER BY submitted_at DESC`,
      [exhibitionId]
    );

    const submissions = await Promise.all(
      result.rows.map(async (row: {
        id: string;
        artwork_id: string;
        exhibition_id: string;
        status: string;
        feedback: string | null;
        submitted_at: Date;
      }) => {
        const artwork = await artworkRepository.findById(row.artwork_id);
        if (!artwork) {
          throw new Error(`Artwork ${row.artwork_id} not found`);
        }

        const exhibitionResult = await query<{ title: string }>(
          `SELECT title FROM exhibitions WHERE id = $1`,
          [row.exhibition_id]
        );

        return this.mapRowToSubmission(row, artwork, exhibitionResult.rows[0]?.title || '');
      })
    );

    return submissions;
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Submission[]> {
    const result = await query<{
      id: string;
      artwork_id: string;
      exhibition_id: string;
      status: string;
      feedback: string | null;
      submitted_at: Date;
    }>(
      `SELECT id, artwork_id, exhibition_id, status, feedback, submitted_at
       FROM submissions
       WHERE status = $1
       ORDER BY submitted_at DESC`,
      [status]
    );

    const submissions = await Promise.all(
      result.rows.map(async (row: {
        id: string;
        artwork_id: string;
        exhibition_id: string;
        status: string;
        feedback: string | null;
        submitted_at: Date;
      }) => {
        const artwork = await artworkRepository.findById(row.artwork_id);
        if (!artwork) {
          throw new Error(`Artwork ${row.artwork_id} not found`);
        }

        const exhibitionResult = await query<{ title: string }>(
          `SELECT title FROM exhibitions WHERE id = $1`,
          [row.exhibition_id]
        );

        return this.mapRowToSubmission(row, artwork, exhibitionResult.rows[0]?.title || '');
      })
    );

    return submissions;
  }

  async findByArtist(artistId: string): Promise<Submission[]> {
    const result = await query<{
      id: string;
      artwork_id: string;
      exhibition_id: string;
      status: string;
      feedback: string | null;
      submitted_at: Date;
    }>(
      `SELECT s.id, s.artwork_id, s.exhibition_id, s.status, s.feedback, s.submitted_at
       FROM submissions s
       JOIN artworks a ON s.artwork_id = a.id
       WHERE a.artist_id = $1
       ORDER BY s.submitted_at DESC`,
      [artistId]
    );

    const submissions = await Promise.all(
      result.rows.map(async (row: {
        id: string;
        artwork_id: string;
        exhibition_id: string;
        status: string;
        feedback: string | null;
        submitted_at: Date;
      }) => {
        const artwork = await artworkRepository.findById(row.artwork_id);
        if (!artwork) {
          throw new Error(`Artwork ${row.artwork_id} not found`);
        }

        const exhibitionResult = await query<{ title: string }>(
          `SELECT title FROM exhibitions WHERE id = $1`,
          [row.exhibition_id]
        );

        return this.mapRowToSubmission(row, artwork, exhibitionResult.rows[0]?.title || '');
      })
    );

    return submissions;
  }

  async updateStatus(
    id: string,
    status: 'approved' | 'rejected',
    feedback?: string
  ): Promise<boolean> {
    const result = await query(
      `UPDATE submissions
       SET status = $1, feedback = $2
       WHERE id = $3`,
      [status, feedback || null, id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  private mapRowToSubmission(
    row: {
      id: string;
      artwork_id: string;
      exhibition_id: string;
      status: string;
      feedback: string | null;
      submitted_at: Date;
    },
    artwork: any,
    exhibitionTitle: string
  ): Submission {
    return {
      id: row.id,
      artworkId: row.artwork_id,
      artwork,
      exhibitionId: row.exhibition_id,
      exhibitionTitle,
      status: row.status as 'pending' | 'approved' | 'rejected',
      feedback: row.feedback || undefined,
      submittedAt: row.submitted_at.toISOString(),
    };
  }
}

export const submissionRepository = new SubmissionRepository();

