import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { submissionRepository } from '@/lib/repositories/SubmissionRepository';
import { initializeDatabase } from '@/lib/db/init';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    const { id } = await params;
    const body = await request.json();
    const { status, feedback } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const success = await submissionRepository.updateStatus(id, status, feedback);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission update error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

