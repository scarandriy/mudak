import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/lib/repositories/UserRepository';
import { initializeDatabase } from '@/lib/db/init';
import { getServerUser } from '@/lib/auth/server';

export async function PATCH(request: NextRequest) {
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
    const { name, bio, contact, socialLinks } = body;

    const updatedUser = await userRepository.update(user.id, {
      name,
      bio,
      contact,
      socialLinks,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}

