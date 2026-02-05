import { NextResponse } from 'next/server';
import { teamMemberRepository } from '@/lib/repositories/TeamMemberRepository';
import { initializeDatabase } from '@/lib/db/init';

export async function GET() {
  try {
    await initializeDatabase();
    const members = await teamMemberRepository.findAll();
    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
