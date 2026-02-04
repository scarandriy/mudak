import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
import { initializeDatabase } from '@/lib/db/init';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { organizerId, title, description, startDate, endDate, location, isVisible, capacity } = body;

    if (!organizerId || !title || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const exhibition = await exhibitionRepository.create(
      organizerId,
      title,
      description,
      startDate,
      endDate,
      location,
      isVisible ?? false,
      capacity
    );
    
    return NextResponse.json({ success: true, exhibition });
  } catch (error) {
    console.error('Exhibition creation error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
