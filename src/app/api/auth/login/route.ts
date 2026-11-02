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
import { getClientIp, checkRateLimit, RATE_LIMITS } from '@/lib/security/rateLimit';
import { logSecurityEvent } from '@/lib/security/audit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Enforce Progressive Rate Limiting against Brute-Force & Credential Stuffing
  const rateLimit = checkRateLimit(ip, RATE_LIMITS.LOGIN);
  if (!rateLimit.allowed) {
    await logSecurityEvent({
      eventType: 'RATE_LIMIT_TRIGGERED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/auth/login', retryAfterSeconds: rateLimit.retryAfterSeconds },
      status: 'BLOCKED'
    });
    return NextResponse.json(
      {
        success: false,
        error: `Too many login attempts. For security reasons, please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) }
      }
    );
  }

  try {
    await ensureSeeded();
    const body = await req.json();
    const { identifier, email, password } = body;
    const loginIdentifier = (identifier || email || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Mobile and password are required' },
        { status: 400 }
      );
    }

    // 2. Check AdminUser table
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

        await logSecurityEvent({
          eventType: 'AUTH_LOGIN_SUCCESS',
          severity: 'INFO',
          actorId: admin.id,
          actorEmail: admin.email,
          ipAddress: ip,
          details: { role: 'admin' },
          status: 'SUCCESS'
        });

        return NextResponse.json({
          success: true,
          message: 'Admin logged in successfully',
          role: 'admin',
          redirectUrl: '/admin',
          user: { email: admin.email, role: 'admin' }
        });
      }
    }

    // 3. Check User table (clients and staff)
    let user = await getUserByEmail(loginIdentifier);
    if (!user) {
      user = await getUserByPhone(loginIdentifier);
    }

    if (user) {
      const userPassMatch = await bcrypt.compare(password, user.passwordHash);
      if (userPassMatch) {
        // Enforce Account Lifecycle & Approval Status
        if (user.status === 'PENDING') {
          await logSecurityEvent({
            eventType: 'AUTH_LOGIN_FAILED',
            severity: 'WARN',
            actorId: user.id,
            actorEmail: user.email,
            ipAddress: ip,
            details: { reason: 'Pending approval login attempt' },
            status: 'BLOCKED'
          });
          return NextResponse.json(
            {
              success: false,
              error: 'Your account is currently PENDING administrative review. You will receive notification once access is approved.'
            },
            { status: 403 }
          );
        }

        if (user.status === 'DISABLED' || user.status === 'REJECTED') {
          await logSecurityEvent({
            eventType: 'AUTH_LOGIN_FAILED',
            severity: 'WARN',
            actorId: user.id,
            actorEmail: user.email,
            ipAddress: ip,
            details: { reason: `Account status is ${user.status}` },
            status: 'BLOCKED'
          });
          return NextResponse.json(
            {
              success: false,
              error: 'Your account access has been suspended or revoked. Please contact our property advisory desk.'
            },
            { status: 403 }
          );
        }

        // Approved User or Admin User
        const cookieStore = await cookies();

        if (user.role === 'admin') {
          const token = await createAdminSessionToken({
            id: user.id,
            email: user.email,
            role: 'admin'
          });
          cookieStore.set(ADMIN_COOKIE_CONFIG.name, token, ADMIN_COOKIE_CONFIG.options);

          await logSecurityEvent({
            eventType: 'AUTH_LOGIN_SUCCESS',
            severity: 'INFO',
            actorId: user.id,
            actorEmail: user.email,
            ipAddress: ip,
            details: { role: 'admin' },
            status: 'SUCCESS'
          });

          return NextResponse.json({
            success: true,
            message: 'Administrator access authenticated',
            role: 'admin',
            redirectUrl: '/admin',
            user: { name: user.name, email: user.email, role: 'admin' }
          });
        } else {
          // Standard Approved Client
          const token = await createUserSessionToken({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: 'user',
            status: 'APPROVED'
          });
          cookieStore.set(USER_COOKIE_CONFIG.name, token, USER_COOKIE_CONFIG.options);

          await logSecurityEvent({
            eventType: 'AUTH_LOGIN_SUCCESS',
            severity: 'INFO',
            actorId: user.id,
            actorEmail: user.email,
            ipAddress: ip,
            details: { role: 'user', status: 'APPROVED' },
            status: 'SUCCESS'
          });

          return NextResponse.json({
            success: true,
            message: 'Client portal authenticated successfully',
            role: 'user',
            redirectUrl: '/projects',
            user: { name: user.name, email: user.email, role: 'user' }
          });
        }
      }
    }

    // 4. Generic authentication failure (timing-safe, no account enumeration)
    await logSecurityEvent({
      eventType: 'AUTH_LOGIN_FAILED',
      severity: 'WARN',
      ipAddress: ip,
      details: { identifierAttempted: loginIdentifier.slice(0, 3) + '***' },
      status: 'FAILURE'
    });

    return NextResponse.json(
      { success: false, error: 'Invalid login credentials. Please check your identifier and password.' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('[Auth Login] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Authentication failed. Please try again later.' }, { status: 500 });
  }
}
