import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/lib/repositories/UserRepository';
import { initializeDatabase } from '@/lib/db/init';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create(email, name, role as UserRole, passwordHash);

    const response = NextResponse.json({ success: true, user });
    
    // Session-only cookie (no maxAge = browser session only)
    response.cookies.set('user_id', user.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      // No maxAge - cookie expires when browser closes
    });
    
    return response;
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

