import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { exhibitionRepository } from '@/lib/repositories/ExhibitionRepository';
import { initializeDatabase } from '@/lib/db/init';
import { getServerUser } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await getServerUser();
    if (!user || user.role !== 'organizer') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, description, startDate, endDate, location, isVisible, capacity } = body;

    if (!title || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const exhibition = await exhibitionRepository.create(
      user.id,
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
