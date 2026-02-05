import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/utils/geocoding';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      );
    }

    const result = await geocodeAddress(address);

    if (result) {
      return NextResponse.json({
        success: true,
        data: {
          latitude: result.lat,
          longitude: result.lng,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Could not geocode address',
      });
    }
  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
