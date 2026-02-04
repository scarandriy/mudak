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
    if (!user || user.role !== 'organizer') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { verified, feedback } = body;

    const exhibition = await exhibitionRepository.findById(id);
    
    if (!exhibition) {
      return NextResponse.json(
        { success: false, error: 'Exhibition not found' },
        { status: 404 }
      );
    }

    if (verified === true) {
      const verifiedExhibition = await exhibitionRepository.verify(id, feedback);
      return NextResponse.json({ success: true, exhibition: verifiedExhibition });
    } else {
      // Reject - set verified to false and store feedback
      const rejectedExhibition = await exhibitionRepository.reject(id, feedback);
      return NextResponse.json({ success: true, exhibition: rejectedExhibition });
    }
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing verification' },
      { status: 500 }
    );
  }
}

