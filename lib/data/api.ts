import 'server-only';
import { Artwork, Exhibition, Registration, Sponsor, Submission, User, UserRole } from '@/lib/types';
import { initializeDatabase } from '@/lib/db/init';
import { artworkRepository } from '@/lib/repositories/ArtworkRepository';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
import { userRepository } from '@/lib/repositories/UserRepository';
import { registrationRepository } from '@/lib/repositories/RegistrationRepository';
import { sponsorRepository } from '@/lib/repositories/SponsorRepository';
import { submissionRepository } from '@/lib/repositories/SubmissionRepository';

let initInProgress = false;
let initCompleted = false;

async function ensureDbInitialized() {
  if (initCompleted) {
    return;
  }
  
  if (initInProgress) {
    // Wait for initialization to complete
    while (initInProgress) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }
  
  initInProgress = true;
  try {
    await initializeDatabase();
    initCompleted = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    initInProgress = false;
    throw error;
  } finally {
    initInProgress = false;
  }
}

// Artworks
export async function getArtworks(filters?: { artistId?: string; type?: string }, sort?: 'recent' | 'popular'): Promise<Artwork[]> {
  await ensureDbInitialized();
  return artworkRepository.findAll(filters, sort);
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  await ensureDbInitialized();
  return artworkRepository.findById(id);
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
  await ensureDbInitialized();
  return artworkRepository.findByArtist(artistId);
}

// Exhibitions
export async function getExhibitions(onlyVisible: boolean = false): Promise<Exhibition[]> {
  await ensureDbInitialized();
  return exhibitionRepository.findAll(onlyVisible);
}

export async function getExhibitionById(id: string): Promise<Exhibition | null> {
  await ensureDbInitialized();
  return exhibitionRepository.findById(id);
}

export async function getExhibitionsByOrganizer(organizerId: string): Promise<Exhibition[]> {
  await ensureDbInitialized();
  return exhibitionRepository.findByOrganizer(organizerId);
}

export async function getExhibitionsByArtist(artistId: string): Promise<Exhibition[]> {
  await ensureDbInitialized();
  return exhibitionRepository.findByArtist(artistId);
}

// Users
export async function getUserById(id: string): Promise<User | null> {
  await ensureDbInitialized();
  return userRepository.findById(id);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await ensureDbInitialized();
  return userRepository.findByEmail(email);
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  await ensureDbInitialized();
  return userRepository.findByRole(role);
}

// Registrations
export async function getRegistrationsByUser(userId: string): Promise<Registration[]> {
  await ensureDbInitialized();
  return registrationRepository.findByUser(userId);
}

export async function getRegistrationsByExhibition(exhibitionId: string): Promise<Registration[]> {
  await ensureDbInitialized();
  return registrationRepository.findByExhibition(exhibitionId);
}

export async function getRegistrationByUserAndExhibition(userId: string, exhibitionId: string): Promise<Registration | null> {
  await ensureDbInitialized();
  return registrationRepository.findByUserAndExhibition(userId, exhibitionId);
}

export async function createRegistration(exhibitionId: string, userId: string, _userName: string, _exhibitionTitle: string): Promise<Registration> {
  await ensureDbInitialized();
  const exhibition = await getExhibitionById(exhibitionId);
  const existingRegistrations = await getRegistrationsByExhibition(exhibitionId);
  
  if (exhibition?.capacity && existingRegistrations.filter(r => r.status === 'confirmed').length >= exhibition.capacity) {
    throw new Error('Event is full. No spots available.');
  }

  return registrationRepository.create(exhibitionId, userId, 'confirmed');
}

export async function cancelRegistration(registrationId: string): Promise<boolean> {
  await ensureDbInitialized();
  return registrationRepository.delete(registrationId);
}

// Sponsors
export async function getSponsorsByExhibition(exhibitionId: string): Promise<Sponsor[]> {
  await ensureDbInitialized();
  return sponsorRepository.findByExhibition(exhibitionId);
}

// Submissions
export async function getSubmissionsByExhibition(exhibitionId: string): Promise<Submission[]> {
  await ensureDbInitialized();
  return submissionRepository.findByExhibition(exhibitionId);
}

export async function getSubmissionsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Submission[]> {
  await ensureDbInitialized();
  return submissionRepository.findByStatus(status);
}

export async function getSubmissionsByArtist(artistId: string): Promise<Submission[]> {
  await ensureDbInitialized();
  return submissionRepository.findByArtist(artistId);
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: 'approved' | 'rejected',
  feedback?: string
): Promise<boolean> {
  await ensureDbInitialized();
  return submissionRepository.updateStatus(submissionId, status, feedback);
}

// Create/Update Artworks
export async function createArtwork(
  artistId: string,
  artistName: string,
  title: string,
  description: string,
  type: string,
  imageUrl: string
): Promise<Artwork> {
  await ensureDbInitialized();
  return artworkRepository.create(artistId, title, description, type, imageUrl);
}

export async function updateArtwork(
  id: string,
  updates: Partial<Pick<Artwork, 'title' | 'description' | 'type' | 'imageUrl'>>
): Promise<boolean> {
  await ensureDbInitialized();
  try {
    await artworkRepository.update(id, updates);
    return true;
  } catch {
    return false;
  }
}

export async function deleteArtwork(id: string): Promise<boolean> {
  await ensureDbInitialized();
  return artworkRepository.delete(id);
}

// Create/Update Exhibitions
export async function createExhibition(
  organizerId: string,
  organizerName: string,
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  location: string,
  isVisible: boolean = false,
  capacity?: number
): Promise<Exhibition> {
  await ensureDbInitialized();
  return exhibitionRepository.create(organizerId, title, description, startDate, endDate, location, isVisible, capacity);
}

export async function updateExhibition(
  id: string,
  updates: Partial<Pick<Exhibition, 'title' | 'description' | 'startDate' | 'endDate' | 'location' | 'capacity' | 'isVisible'>>
): Promise<boolean> {
  await ensureDbInitialized();
  try {
    await exhibitionRepository.update(id, updates);
    return true;
  } catch {
    return false;
  }
}

export async function toggleExhibitionVisibility(id: string): Promise<boolean> {
  await ensureDbInitialized();
  const exhibition = await exhibitionRepository.findById(id);
  if (exhibition) {
    await exhibitionRepository.update(id, { isVisible: !exhibition.isVisible });
    return true;
  }
  return false;
}

export async function assignArtworkToExhibition(exhibitionId: string, artworkId: string): Promise<boolean> {
  await ensureDbInitialized();
  return exhibitionRepository.assignArtwork(exhibitionId, artworkId);
}

export async function removeArtworkFromExhibition(exhibitionId: string, artworkId: string): Promise<boolean> {
  await ensureDbInitialized();
  return exhibitionRepository.removeArtwork(exhibitionId, artworkId);
}

