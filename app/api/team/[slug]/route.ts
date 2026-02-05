import { NextRequest, NextResponse } from 'next/server';
import { teamMemberRepository } from '@/lib/repositories/TeamMemberRepository';
import { initializeDatabase } from '@/lib/db/init';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await initializeDatabase();
    const { slug } = await params;
    const member = await teamMemberRepository.findBySlug(slug);
    
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}
