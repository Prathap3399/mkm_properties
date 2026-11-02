import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getAllDocuments, createDocument } from '@/lib/db/repository';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

const VALID_CATEGORIES = new Set(['Brochure', 'Layout', 'Approval', 'Legal', 'Price Sheet']);

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const projectId = searchParams.get('projectId') || undefined;
  const search = searchParams.get('search') || undefined;

  const documents = await getAllDocuments({ category, projectId, search });
  return NextResponse.json({ success: true, documents });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  const ip = getClientIp(req);

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, category, fileUrl, fileSize, projectId, isProtected } = body;

    if (!title || !category || !fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and file URL are required' },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category. Must be one of: ${Array.from(VALID_CATEGORIES).join(', ')}` },
        { status: 400 }
      );
    }

    const cleanFileUrl = fileUrl.trim();
    if (cleanFileUrl.includes('..') || cleanFileUrl.toLowerCase().startsWith('javascript:')) {
      return NextResponse.json(
        { success: false, error: 'Invalid or unsafe file URL' },
        { status: 400 }
      );
    }

    const doc = await createDocument({
      title: title.trim().slice(0, 150),
      description: description ? description.trim().slice(0, 500) : null,
      category,
      fileUrl: cleanFileUrl,
      fileSize: fileSize ? fileSize.trim().slice(0, 20) : '1.5 MB',
      fileType: 'pdf',
      projectId: projectId || null,
      isProtected: isProtected !== undefined ? (isProtected ? 1 : 0) : 1
    });

    await logSecurityEvent({
      eventType: 'DOCUMENT_DOWNLOAD', // action tracked
      severity: 'INFO',
      actorId: session.id,
      actorEmail: session.email,
      ipAddress: ip,
      details: { action: 'create_document', docId: doc?.id, title: doc?.title },
      status: 'SUCCESS'
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (err: any) {
    console.error('[Document Create] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
