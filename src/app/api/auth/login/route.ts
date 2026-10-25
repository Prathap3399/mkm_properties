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

    // 2. Check User table by email or phone
    let user = await getUserByEmail(loginIdentifier);
    if (!user) {
      user = await getUserByPhone(loginIdentifier);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. If you booked a site visit, please wait for admin approval.' },
        { status: 401 }
      );
    }

    // Verify user password
    const userPassMatch = await bcrypt.compare(password, user.passwordHash);
    if (!userPassMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Please verify your email/phone and password.' },
        { status: 401 }
      );
    }

    // 3. Enforce approval status!
    if (user.role === 'admin') {
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

    if (user.status === 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your account is currently PENDING approval. Our team verifies site-visit enquiries before granting full portal access. We will notify you shortly.',
          status: 'PENDING'
        },
        { status: 403 }
      );
    }

    if (user.status === 'DISABLED' || user.status === 'REJECTED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your access to the property portal has been disabled. Please contact PRATHAP at 96290 48171.',
          status: user.status
        },
        { status: 403 }
      );
    }

    if (user.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Account not authorized for access.' },
        { status: 403 }
      );
    }

    // 4. Issue User Session Token
    const userToken = await createUserSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: 'user',
      status: 'APPROVED'
    });

    const cookieStore = await cookies();
    cookieStore.set(USER_COOKIE_CONFIG.name, userToken, USER_COOKIE_CONFIG.options);

    return NextResponse.json({
      success: true,
      message: 'Access granted. Welcome to MKM Client Portal.',
      role: 'user',
      redirectUrl: '/dashboard',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'user',
        status: user.status
      }
    });
  } catch (error: any) {
    console.error('[Auth Login] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
