import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/lib/repositories/UserRepository';
import { initializeDatabase } from '@/lib/db/init';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await userRepository.findByEmailWithPassword(email);
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, result.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.user;
    
    if (!user || !user.id || !user.email || !user.name || !user.role) {
      return NextResponse.json(
        { success: false, error: 'Invalid user data' },
        { status: 500 }
      );
    }
    
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
  } catch {
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

