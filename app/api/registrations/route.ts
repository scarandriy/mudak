import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { registrationRepository } from '@/lib/repositories/RegistrationRepository';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
import { initializeDatabase } from '@/lib/db/init';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { exhibitionId, userId } = body;

    if (!exhibitionId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Exhibition ID and User ID are required' },
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

    // Check if user is already registered
    const existingRegistration = await registrationRepository.findByUserAndExhibition(userId, exhibitionId);
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

    const registration = await registrationRepository.create(exhibitionId, userId, 'confirmed');
    
    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Registration creation error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

