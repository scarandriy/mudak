import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/auth/server';

export async function GET() {
  try {
    const user = await getServerUser();
    
    return NextResponse.json({
      user: user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null,
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
}

