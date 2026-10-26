import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getAdminByEmail, getUserByEmail, getUserByPhone, ensureSeeded } from '@/lib/db/repository';
import {
  createAdminSessionToken,
  createUserSessionToken,
  ADMIN_COOKIE_CONFIG,
  USER_COOKIE_CONFIG
} from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const { identifier, email, password } = await req.json();
    const loginIdentifier = (identifier || email || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Mobile and password are required' },
        { status: 400 }
      );
    }

    // 1. Check if matches Admin first
    const admin = await getAdminByEmail(loginIdentifier);
    if (admin) {
      const adminPassMatch = await bcrypt.compare(password, admin.passwordHash);
      if (adminPassMatch) {
        const token = await createAdminSessionToken({
          id: admin.id,
          email: admin.email,
          role: admin.role
        });

        const cookieStore = await cookies();
        cookieStore.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

        return NextResponse.json({
          success: true,
          message: 'Admin logged in successfully',
          role: 'admin',
          redirectUrl: '/admin',
          user: { email: admin.email, role: 'admin' }
        });
      }
    }

    // 2. Check User table if configured with admin role
    let user = await getUserByEmail(loginIdentifier);
    if (!user) {
      user = await getUserByPhone(loginIdentifier);
    }

    if (user && user.role === 'admin') {
      const userPassMatch = await bcrypt.compare(password, user.passwordHash);
      if (userPassMatch) {
        const token = await createAdminSessionToken({
          id: user.id,
          email: user.email,
          role: 'admin'
        });
        const cookieStore = await cookies();
        cookieStore.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

        return NextResponse.json({
          success: true,
          message: 'Administrator access authenticated',
          role: 'admin',
          redirectUrl: '/admin',
          user: { name: user.name, email: user.email, role: 'admin' }
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid administrator credentials.' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('[Auth Login] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
