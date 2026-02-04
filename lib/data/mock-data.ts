import { User, Artwork, Exhibition, Registration, Sponsor, Submission } from '@/lib/types';

export const mockUsers: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'artist@example.com',
    name: 'Eleanor Antin',
    role: 'artist',
    bio: 'Pioneer representative of conceptual, feminist art.',
    contact: 'contact@eleanorantin.com',
    socialLinks: {
      website: 'https://eleanorantin.com',
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'organizer@example.com',
    name: 'Bettina Steinbrügge',
    role: 'organizer',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'visitor@example.com',
    name: 'John Visitor',
    role: 'visitor',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
];

export const mockArtworks: Artwork[] = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    title: '100 Boots',
    description: 'A road movie without people - an iconic photographic series exploring narrative and movement.',
    type: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    artistId: '00000000-0000-0000-0000-000000000001',
    artistName: 'Eleanor Antin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    title: 'Carving: A Traditional Sculpture',
    description: 'An early feminist examination of the female body through taxonomy systems.',
    type: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    artistId: '00000000-0000-0000-0000-000000000001',
    artistName: 'Eleanor Antin',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    title: 'The Ballerina',
    description: 'A series exploring identity through fictional alter egos.',
    type: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    artistId: '00000000-0000-0000-0000-000000000001',
    artistName: 'Eleanor Antin',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

export const mockExhibitions: Exhibition[] = [
  {
    id: '00000000-0000-0000-0000-000000000201',
    title: 'Eleanor Antin: A Retrospective',
    description: 'This first major retrospective since 1999 presents Antin\'s œuvre in full breadth. The exhibition highlights the continued relevance and influence of her work from the late 1960s till today.',
    startDate: '2025-09-26',
    endDate: '2026-02-08',
    location: 'Mudam Luxembourg',
    isVisible: true,
    organizerId: '00000000-0000-0000-0000-000000000002',
    organizerName: 'Bettina Steinbrügge',
    artworkIds: ['00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000103'],
    capacity: 100,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000202',
    title: 'Contemporary Perspectives',
    description: 'Exploring modern artistic expressions and cultural narratives.',
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    location: 'Gallery Space A',
    isVisible: true,
    organizerId: '00000000-0000-0000-0000-000000000002',
    organizerName: 'Bettina Steinbrügge',
    artworkIds: [],
    capacity: 50,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: '00000000-0000-0000-0000-000000000301',
    exhibitionId: '00000000-0000-0000-0000-000000000201',
    exhibitionTitle: 'Eleanor Antin: A Retrospective',
    userId: '00000000-0000-0000-0000-000000000003',
    userName: 'John Visitor',
    status: 'confirmed',
    registeredAt: '2024-01-15T10:00:00Z',
  },
];

export const mockSponsors: Sponsor[] = [
  {
    id: '00000000-0000-0000-0000-000000000401',
    name: 'Dikamar',
    exhibitionId: '00000000-0000-0000-0000-000000000201',
  },
  {
    id: '00000000-0000-0000-0000-000000000402',
    name: 'Le Monde',
    exhibitionId: '00000000-0000-0000-0000-000000000201',
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: '00000000-0000-0000-0000-000000000501',
    artworkId: '00000000-0000-0000-0000-000000000101',
    artwork: mockArtworks[0],
    exhibitionId: '00000000-0000-0000-0000-000000000202',
    exhibitionTitle: 'Contemporary Perspectives',
    status: 'pending',
    submittedAt: '2024-01-20T10:00:00Z',
  },
];

