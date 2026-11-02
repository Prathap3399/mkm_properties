import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDatabase } from '@/lib/db';
import { logSecurityEvent } from '@/lib/security/audit';
import { getJwtSecret } from '@/lib/auth/secret';

export const ADMIN_COOKIE_NAME = 'mkm_admin_token';
export const USER_COOKIE_NAME = 'mkm_user_token';

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

export interface UserSessionPayload {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'PENDING' | 'APPROVED' | 'DISABLED' | 'REJECTED';
}

export async function createAdminSessionToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h') // 24 hour session
    .sign(getJwtSecret());
}

export async function verifyAdminSessionToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256']
    });
    if (!payload.id || !payload.email || payload.role !== 'admin') {
      return null;
    }
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string
    };
  } catch {
    return null;
  }
}

export async function createUserSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h') // 24 hour session
    .sign(getJwtSecret());
}

export async function verifyUserSessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256']
    });
    if (!payload.id || !payload.email) {
      return null;
    }
    return {
      id: payload.id as string,
      name: (payload.name as string) || 'Client',
      email: payload.email as string,
      phone: payload.phone as string | undefined,
      role: (payload.role as 'user' | 'admin') || 'user',
      status: (payload.status as 'PENDING' | 'APPROVED' | 'DISABLED' | 'REJECTED') || 'PENDING'
    };
  } catch {
    return null;
  }
}

// Authoritative Database-backed admin session retrieval
export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyAdminSessionToken(token);
    if (!payload) return null;

    // Authoritative verification against database
    const db = getDatabase();
    const adminRecord = await db.get<{ id: string; email: string; role: string }>(
      'SELECT id, email, role FROM AdminUser WHERE id = ?',
      [payload.id]
    );

    if (!adminRecord || adminRecord.role !== 'admin') {
      await logSecurityEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'WARN',
        actorId: payload.id,
        actorEmail: payload.email,
        details: { reason: 'Admin account no longer valid in database' },
        status: 'BLOCKED'
      });
      return null;
    }

    return {
      id: adminRecord.id,
      email: adminRecord.email,
      role: adminRecord.role
    };
  } catch (err: any) {
    console.error('[Session] Admin session verification error:', err.message);
    return null;
  }
}

// Authoritative Database-backed user session retrieval
export async function getUserSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();

    // 1. Check user token first
    const userToken = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (userToken) {
      const userPayload = await verifyUserSessionToken(userToken);
      if (userPayload) {
        // Authoritative verification against active database status!
        const db = getDatabase();
        const userRecord = await db.get<{
          id: string;
          name: string;
          email: string;
          phone: string;
          role: string;
          status: string;
        }>(
          'SELECT id, name, email, phone, role, status FROM User WHERE id = ?',
          [userPayload.id]
        );

        if (!userRecord) {
          return null;
        }

        // Enforce active approval: Revoke if status was modified by admin
        if (userRecord.status !== 'APPROVED' && userRecord.role !== 'admin') {
          await logSecurityEvent({
            eventType: 'ACCESS_DENIED',
            severity: 'WARN',
            actorId: userRecord.id,
            actorEmail: userRecord.email,
            details: { reason: `Session rejected: User account status is ${userRecord.status}` },
            status: 'BLOCKED'
          });
          return null;
        }

        return {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          phone: userRecord.phone,
          role: userRecord.role as 'user' | 'admin',
          status: userRecord.status as 'PENDING' | 'APPROVED' | 'DISABLED' | 'REJECTED'
        };
      }
    }

    // 2. Allow verified admin token to act as approved session
    const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (adminToken) {
      const adminPayload = await getAdminSession();
      if (adminPayload) {
        return {
          id: adminPayload.id,
          name: 'Administrator',
          email: adminPayload.email,
          role: 'admin',
          status: 'APPROVED'
        };
      }
    }

    return null;
  } catch (err: any) {
    console.error('[Session] User session verification error:', err.message);
    return null;
  }
}

export async function requireApprovedUser(redirectPath = '/login?unauthorized=true') {
  const session = await getUserSession();
  if (!session || (session.status !== 'APPROVED' && session.role !== 'admin')) {
    redirect(redirectPath);
  }
  return session;
}

export async function requireAdmin(redirectPath = '/admin/login') {
  const session = await getAdminSession();
  if (!session || session.role !== 'admin') {
    redirect(redirectPath);
  }
  return session;
}

export const ADMIN_COOKIE_CONFIG = {
  name: ADMIN_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  }
};

export const USER_COOKIE_CONFIG = {
  name: USER_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  }
};
