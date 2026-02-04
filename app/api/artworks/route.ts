import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { artworkRepository } from '@/lib/repositories/ArtworkRepository';
import { initializeDatabase } from '@/lib/db/init';
import { getServerUser } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { artistId, title, description, type, imageUrl } = body;

    if (!artistId || !title || !description || !type || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Artists can create for themselves; organizers can create for any artist
    if (user.role !== 'organizer' && artistId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const artwork = await artworkRepository.create(artistId, title, description, type, imageUrl);
    
    return NextResponse.json({ success: true, artwork });
  } catch (error) {
    console.error('Artwork creation error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

