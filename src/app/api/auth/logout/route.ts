import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_CONFIG, USER_COOKIE_CONFIG, getUserSession } from '@/lib/auth/session';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const session = await getUserSession();

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_CONFIG.name);
  cookieStore.delete(USER_COOKIE_CONFIG.name);

  if (session) {
    await logSecurityEvent({
      eventType: 'AUTH_LOGOUT',
      severity: 'INFO',
      actorId: session.id,
      actorEmail: session.email,
      ipAddress: ip,
      status: 'SUCCESS'
    });
  }

  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
