import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { registrationRepository } from '@/lib/repositories/RegistrationRepository';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
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
    const { exhibitionId } = body;

    if (!exhibitionId) {
      return NextResponse.json(
        { success: false, error: 'Exhibition ID is required' },
        { status: 400 }
      );
    }

    const exhibition = await exhibitionRepository.findById(exhibitionId);
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: 'Exhibition not found' },
        { status: 404 }
      );
    }

    // Check if user is already registered (use server user id only)
    const existingRegistration = await registrationRepository.findByUserAndExhibition(user.id, exhibitionId);
    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'You are already registered for this exhibition' },
        { status: 409 }
      );
    }

    const existingRegistrations = await registrationRepository.findByExhibition(exhibitionId);
    const confirmedCount = existingRegistrations.filter(r => r.status === 'confirmed').length;

    if (exhibition.capacity && confirmedCount >= exhibition.capacity) {
      return NextResponse.json(
        { success: false, error: 'Event is full. No spots available.' },
        { status: 409 }
      );
    }

    const registration = await registrationRepository.create(exhibitionId, user.id, 'confirmed');
    
    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Registration creation error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

