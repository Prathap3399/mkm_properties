import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET_STRING = process.env.ADMIN_JWT_SECRET || 'mkm_properties_super_secure_secret_key_2026_trichy_real_estate';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

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
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminSessionToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string
    };
  } catch (error) {
    return null;
  }
}

export async function createUserSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyUserSessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: (payload.name as string) || 'Client',
      email: payload.email as string,
      phone: payload.phone as string | undefined,
      role: (payload.role as 'user' | 'admin') || 'user',
      status: (payload.status as 'PENDING' | 'APPROVED' | 'DISABLED' | 'REJECTED') || 'PENDING'
    };
  } catch (error) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  
  // 1. Check user token
  const userToken = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (userToken) {
    const userPayload = await verifyUserSessionToken(userToken);
    if (userPayload) return userPayload;
  }

  // 2. Also allow admin token to act as approved user session
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const adminPayload = await verifyAdminSessionToken(adminToken);
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
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  }
};

export const USER_COOKIE_CONFIG = {
  name: USER_COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  }
};
