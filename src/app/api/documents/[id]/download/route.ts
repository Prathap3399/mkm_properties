import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUserSession } from '@/lib/auth/session';
import { getDocumentById } from '@/lib/db/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Enforce strict server-side authorization check!
    const session = await getUserSession();
    if (!session || (session.status !== 'APPROVED' && session.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Approved client credentials required to download property documents.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const document = await getDocumentById(id);

    if (!document) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // 2. Resolve file path from public directory
    let relativePath = document.fileUrl.startsWith('/') ? document.fileUrl.slice(1) : document.fileUrl;
    let filePath = path.join(process.cwd(), 'public', relativePath);

    // If file doesn't exist directly, fallback to a standard brochure sample
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'brochures', 'mkm-sterling-avenue-brochure.pdf');
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'Physical document file not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const sanitizedTitle = document.title.replace(/[^a-zA-Z0-9_-]/g, '_');

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizedTitle}.pdf"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate'
      }
    });
  } catch (error: any) {
    console.error('[Document Download API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error downloading document' }, { status: 500 });
  }
}
