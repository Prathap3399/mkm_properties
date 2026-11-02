import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUserSession } from '@/lib/auth/session';
import { getDocumentById } from '@/lib/db/repository';
import { getClientIp, checkRateLimit, RATE_LIMITS } from '@/lib/security/rateLimit';
import { logSecurityEvent } from '@/lib/security/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);

  // 1. Rate limiting on document downloads
  const rateLimit = checkRateLimit(ip, RATE_LIMITS.DOWNLOAD);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many download requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    // 2. Strict server-side authorization check
    const session = await getUserSession();
    if (!session || (session.status !== 'APPROVED' && session.role !== 'admin')) {
      await logSecurityEvent({
        eventType: 'ACCESS_DENIED',
        severity: 'WARN',
        ipAddress: ip,
        details: { endpoint: '/api/documents/[id]/download', reason: 'Unapproved document download attempt' },
        status: 'BLOCKED'
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Approved client credentials required to download property documents.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const document = await getDocumentById(id);

    if (!document) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // 3. Path Traversal Defense: Ensure file path strictly resolves within allowed storage directory
    const baseDir = path.resolve(process.cwd(), 'public');
    const relativePath = document.fileUrl.startsWith('/') ? document.fileUrl.slice(1) : document.fileUrl;
    let resolvedPath = path.resolve(baseDir, relativePath);

    if (!resolvedPath.startsWith(baseDir)) {
      await logSecurityEvent({
        eventType: 'UNAUTHORIZED_FILE_ACCESS',
        severity: 'CRITICAL',
        actorId: session.id,
        actorEmail: session.email,
        ipAddress: ip,
        details: { documentId: id, attemptedPath: document.fileUrl },
        status: 'BLOCKED'
      });
      return NextResponse.json({ success: false, error: 'Access to the requested file path is forbidden' }, { status: 403 });
    }

    // Fallback if missing
    if (!fs.existsSync(resolvedPath)) {
      resolvedPath = path.join(baseDir, 'brochures', 'mkm-sterling-avenue-brochure.pdf');
    }

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ success: false, error: 'Physical document file not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(resolvedPath);
    const sanitizedTitle = document.title.replace(/[^a-zA-Z0-9_-]/g, '_');

    // 4. Log successful authorized download
    await logSecurityEvent({
      eventType: 'DOCUMENT_DOWNLOAD',
      severity: 'INFO',
      actorId: session.id,
      actorEmail: session.email,
      ipAddress: ip,
      details: { documentId: id, documentTitle: document.title, category: document.category },
      status: 'SUCCESS'
    });

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizedTitle}.pdf"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate'
      }
    });
  } catch (error: any) {
    console.error('[Document Download API] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to process document download request' }, { status: 500 });
  }
}
