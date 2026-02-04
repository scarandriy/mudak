import 'server-only';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the cookie by setting it with an expired date
  response.cookies.set('user_id', '', {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Set to epoch time to expire immediately
  });
  
  return response;
}

