import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getAllSiteContents, setSiteContent } from '@/lib/db/repository';

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
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, title, content } = await req.json();

    if (!key || content === undefined) {
      return NextResponse.json({ success: false, error: 'Key and content are required' }, { status: 400 });
    }

    const updated = await setSiteContent(key, content, title);
    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
