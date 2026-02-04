import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { artworkRepository } from '@/lib/repositories/ArtworkRepository';
import { initializeDatabase } from '@/lib/db/init';
import { getServerUser } from '@/lib/auth/server';

export async function PATCH(
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
    const artwork = await artworkRepository.findById(id);
    
    if (!artwork) {
      return NextResponse.json(
        { success: false, error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Allow artists to edit their own artworks, or organizers to edit any artwork
    if (user.role !== 'organizer' && artwork.artistId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, type, imageUrl, artistId } = body;

    if (!title || !description || !type || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Only allow organizers to change the artist
    const updateData: any = {
      title,
      description,
      type,
      imageUrl,
    };

    if (user.role === 'organizer' && artistId) {
      updateData.artistId = artistId;
    }

    const updatedArtwork = await artworkRepository.update(id, updateData);
    
    return NextResponse.json({ success: true, artwork: updatedArtwork });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating artwork' },
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
    const artwork = await artworkRepository.findById(id);
    
    if (!artwork) {
      return NextResponse.json(
        { success: false, error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Allow artists to edit their own artworks, or organizers to edit any artwork
    if (user.role !== 'organizer' && artwork.artistId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const success = await artworkRepository.delete(id);
    
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred while deleting artwork' },
      { status: 500 }
    );
  }
}

