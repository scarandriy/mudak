import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { registrationRepository } from '@/lib/repositories/RegistrationRepository';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
import { initializeDatabase } from '@/lib/db/init';
import { getServerUser } from '@/lib/auth/server';

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
    const registration = await registrationRepository.findById(id);
    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    // User can only cancel their own registration; organizers can cancel any for their exhibitions
    const isOwner = registration.userId === user.id;
    const isOrganizer = user.role === 'organizer';
    const exhibition = isOrganizer ? await exhibitionRepository.findById(registration.exhibitionId) : null;
    const isOrganizerOfExhibition = isOrganizer && exhibition && exhibition.organizerId === user.id;

    if (!isOwner && !isOrganizerOfExhibition) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const success = await registrationRepository.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

