import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
import { initializeDatabase } from '@/lib/db/init';
import { getServerUser } from '@/lib/auth/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const exhibition = await exhibitionRepository.findById(id);
    
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: 'Exhibition not found' },
        { status: 404 }
      );
    }

    // Allow organizers to add artworks to any exhibition, or artists to their own
    if (user.role !== 'organizer' && exhibition.organizerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { artworkId } = body;

    if (!artworkId) {
      return NextResponse.json(
        { success: false, error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    const success = await exhibitionRepository.assignArtwork(id, artworkId);
    
    return NextResponse.json({ success });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred while assigning artwork' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const exhibition = await exhibitionRepository.findById(id);
    
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: 'Exhibition not found' },
        { status: 404 }
      );
    }

    // Allow organizers to add artworks to any exhibition, or artists to their own
    if (user.role !== 'organizer' && exhibition.organizerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const artworkId = searchParams.get('artworkId');

    if (!artworkId) {
      return NextResponse.json(
        { success: false, error: 'Artwork ID is required' },
        { status: 400 }
      );
    }

    const success = await exhibitionRepository.removeArtwork(id, artworkId);
    
    return NextResponse.json({ success });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred while removing artwork' },
      { status: 500 }
    );
  }
}

