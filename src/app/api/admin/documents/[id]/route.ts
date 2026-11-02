import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getDocumentById, updateDocument, deleteDocument } from '@/lib/db/repository';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, document: doc });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  const ip = getClientIp(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.fileUrl && (body.fileUrl.includes('..') || body.fileUrl.toLowerCase().startsWith('javascript:'))) {
    return NextResponse.json({ success: false, error: 'Invalid or unsafe file URL' }, { status: 400 });
  }

  const updated = await updateDocument(id, body);

  await logSecurityEvent({
    eventType: 'DOCUMENT_DOWNLOAD',
    severity: 'INFO',
    actorId: session.id,
    actorEmail: session.email,
    ipAddress: ip,
    details: { action: 'update_document', docId: id },
    status: 'SUCCESS'
  });

  return NextResponse.json({ success: true, document: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  const ip = getClientIp(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await deleteDocument(id);

  await logSecurityEvent({
    eventType: 'DOCUMENT_DOWNLOAD',
    severity: 'WARN',
    actorId: session.id,
    actorEmail: session.email,
    ipAddress: ip,
    details: { action: 'delete_document', docId: id },
    status: 'SUCCESS'
  });

  return NextResponse.json({ success: true, message: 'Document deleted' });
}
