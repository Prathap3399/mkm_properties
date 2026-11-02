import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getAllSiteContents, setSiteContent } from '@/lib/db/repository';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const contents = await getAllSiteContents();
  return NextResponse.json({ success: true, contents });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  const ip = getClientIp(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, title, content } = await req.json();

    if (!key || content === undefined) {
      return NextResponse.json({ success: false, error: 'Key and content are required' }, { status: 400 });
    }

    const cleanKey = String(key).trim().slice(0, 50);
    const cleanTitle = title ? String(title).trim().slice(0, 100) : undefined;

    const updated = await setSiteContent(cleanKey, String(content), cleanTitle);

    await logSecurityEvent({
      eventType: 'USER_ROLE_CHANGE',
      severity: 'INFO',
      actorId: session.id,
      actorEmail: session.email,
      ipAddress: ip,
      details: { action: 'update_site_content', key: cleanKey },
      status: 'SUCCESS'
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    console.error('[Site Content API] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
