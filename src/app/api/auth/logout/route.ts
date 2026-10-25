import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_CONFIG, USER_COOKIE_CONFIG } from '@/lib/auth/session';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_CONFIG.name);
  cookieStore.delete(USER_COOKIE_CONFIG.name);
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
