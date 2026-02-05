export type UserRole = 'public' | 'artist' | 'organizer' | 'visitor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  contact?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Artist extends User {
  role: 'artist';
}

export interface Organizer extends User {
  role: 'organizer';
}

export interface Visitor extends User {
  role: 'visitor';
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  artistId: string;
  artistName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  latitude?: number;
  longitude?: number;
  isVisible: boolean;
  verified?: boolean;
  verificationFeedback?: string;
  organizerId: string;
  organizerName: string;
  artworkIds: string[];
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  exhibitionId: string;
  exhibitionTitle: string;
  userId: string;
  userName: string;
  status: 'confirmed';
  registeredAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
  exhibitionId: string;
}

export interface Submission {
  id: string;
  artworkId: string;
  artwork: Artwork;
  exhibitionId: string;
  exhibitionTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  submittedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  contributions?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

