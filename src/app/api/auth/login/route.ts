import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/db';
import { signAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = verifyAdminCredentials(email, password);
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials or unauthorized account' },
        { status: 401 }
      );
    }

    const sessionPayload = {
      userId: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    const token = await signAdminSession(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'uth_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server authentication error' },
      { status: 500 }
    );
  }
}

