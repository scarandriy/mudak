import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { registrationRepository } from '@/lib/repositories/RegistrationRepository';
import { initializeDatabase } from '@/lib/db/init';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();
    
    const { id } = await params;
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

