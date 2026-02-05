import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
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
    const exhibition = await exhibitionRepository.findById(id);
    
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: 'Exhibition not found' },
        { status: 404 }
      );
    }

    // Allow organizers to edit/delete any exhibition, or artists to edit their own
    if (user.role !== 'organizer' && exhibition.organizerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, startDate, endDate, location, latitude, longitude, isVisible, capacity } = body;

    const updatedExhibition = await exhibitionRepository.update(id, {
      title,
      description,
      startDate,
      endDate,
      location,
      latitude,
      longitude,
      isVisible,
      capacity,
    });

    return NextResponse.json({ success: true, exhibition: updatedExhibition });
  } catch {
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating exhibition' },
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

    // Allow organizers to edit/delete any exhibition, or artists to edit their own
    if (user.role !== 'organizer' && exhibition.organizerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const success = await exhibitionRepository.delete(id);
    
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json(
      { success: false, error: 'An error occurred while deleting exhibition' },
      { status: 500 }
    );
  }
}
