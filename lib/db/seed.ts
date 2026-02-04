import 'server-only';
import { query } from './connection';
import { mockUsers, mockArtworks, mockExhibitions, mockRegistrations, mockSponsors, mockSubmissions } from '@/lib/data/mock-data';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'password123';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function seedDatabase(): Promise<void> {
  try {
    console.log('Starting database seeding...');

    for (const user of mockUsers) {
      const passwordHash = await hashPassword(DEFAULT_PASSWORD);
      
      await query(
        `INSERT INTO users (id, email, name, role, password_hash, bio, contact)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [user.id, user.email, user.name, user.role, passwordHash, user.bio || null, user.contact || null]
      );

      if (user.socialLinks && (user.socialLinks.website || user.socialLinks.instagram || user.socialLinks.twitter)) {
        await query(
          `INSERT INTO artist_social_links (user_id, website, instagram, twitter)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id, user.socialLinks.website || null, user.socialLinks.instagram || null, user.socialLinks.twitter || null]
        );
      }
    }

    console.log('Users seeded');

    for (const artwork of mockArtworks) {
      await query(
        `INSERT INTO artworks (id, title, description, type, image_url, artist_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [artwork.id, artwork.title, artwork.description, artwork.type, artwork.imageUrl, artwork.artistId, artwork.createdAt, artwork.updatedAt]
      );
    }

    console.log('Artworks seeded');

    for (const exhibition of mockExhibitions) {
      await query(
        `INSERT INTO exhibitions (id, title, description, start_date, end_date, location, is_visible, organizer_id, capacity, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [
          exhibition.id,
          exhibition.title,
          exhibition.description,
          exhibition.startDate,
          exhibition.endDate,
          exhibition.location,
          exhibition.isVisible,
          exhibition.organizerId,
          exhibition.capacity || null,
          exhibition.createdAt,
          exhibition.updatedAt,
        ]
      );

      for (const artworkId of exhibition.artworkIds) {
        await query(
          `INSERT INTO exhibitions_artworks (exhibition_id, artwork_id)
           VALUES ($1, $2)
           ON CONFLICT (exhibition_id, artwork_id) DO NOTHING`,
          [exhibition.id, artworkId]
        );
      }
    }

    console.log('Exhibitions seeded');

    for (const registration of mockRegistrations) {
      await query(
        `INSERT INTO registrations (id, exhibition_id, user_id, status, registered_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [registration.id, registration.exhibitionId, registration.userId, registration.status, registration.registeredAt]
      );
    }

    console.log('Registrations seeded');

    for (const sponsor of mockSponsors) {
      await query(
        `INSERT INTO sponsors (id, name, logo_url, exhibition_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [sponsor.id, sponsor.name, sponsor.logoUrl || null, sponsor.exhibitionId]
      );
    }

    console.log('Sponsors seeded');

    for (const submission of mockSubmissions) {
      await query(
        `INSERT INTO submissions (id, artwork_id, exhibition_id, status, feedback, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [submission.id, submission.artworkId, submission.exhibitionId, submission.status, submission.feedback || null, submission.submittedAt]
      );
    }

    console.log('Submissions seeded');
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

