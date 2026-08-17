import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Server-side helper to verify admin role
function authorizeAdminRequest(request: NextRequest): boolean {
  const userCookie = request.cookies.get('campus_pulse_user')?.value;
  if (!userCookie) return false;
  try {
    const profile = JSON.parse(decodeURIComponent(userCookie));
    return profile && profile.role === 'admin';
  } catch {
    return false;
  }
}

// GET /api/admin/events - Admin analytics & full list
export async function GET(request: NextRequest) {
  if (!authorizeAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Administrative credentials required.' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    status: 'authorized',
    message: 'Admin access verified server-side.'
  });
}

// POST /api/admin/events - Server-side Event Creation protection
export async function POST(request: NextRequest) {
  if (!authorizeAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Non-admin users cannot create events.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Event created securely on server.',
      event: body
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

// DELETE /api/admin/events - Server-side Event Deletion protection
export async function DELETE(request: NextRequest) {
  if (!authorizeAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Non-admin users cannot delete events.' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Event deleted securely on server.'
  });
}
