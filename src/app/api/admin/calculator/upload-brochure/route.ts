import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getAdminSession } from '@/lib/auth/session';
import { updateProjectBrochures } from '@/lib/db/repository';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function isValidBrochureUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/brochures/') && !trimmed.includes('..')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const projectId = formData.get('projectId') as string;
      const file = formData.get('file') as File | null;
      const brochureUrlInput = formData.get('brochureUrl') as string | null;

      if (!projectId) {
        return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
      }

      let finalUrl = '';

      if (file && file.size > 0) {
        // 1. File size validation
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { success: false, error: 'File size exceeds maximum allowed limit (15MB)' },
            { status: 400 }
          );
        }

        // 2. File extension validation
        const originalName = file.name || '';
        const ext = path.extname(originalName).toLowerCase();
        if (ext !== '.pdf') {
          await logSecurityEvent({
            eventType: 'FILE_UPLOAD_BLOCKED',
            severity: 'WARN',
            actorId: session.id,
            actorEmail: session.email,
            ipAddress: ip,
            details: { reason: 'Disallowed file extension', attemptedExtension: ext, filename: originalName },
            status: 'BLOCKED'
          });
          return NextResponse.json(
            { success: false, error: 'Only PDF documents (.pdf) are permitted for project brochures' },
            { status: 400 }
          );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. Magic number verification (PDF header: %PDF-)
        const pdfHeader = buffer.subarray(0, 5).toString('ascii');
        if (!pdfHeader.startsWith('%PDF-')) {
          await logSecurityEvent({
            eventType: 'FILE_UPLOAD_BLOCKED',
            severity: 'CRITICAL',
            actorId: session.id,
            actorEmail: session.email,
            ipAddress: ip,
            details: { reason: 'Spoofed MIME / Invalid PDF magic bytes', filename: originalName },
            status: 'BLOCKED'
          });
          return NextResponse.json(
            { success: false, error: 'Invalid file content. Uploaded file is not a valid PDF document.' },
            { status: 400 }
          );
        }

        const brochuresDir = path.join(process.cwd(), 'public', 'brochures');
        if (!fs.existsSync(brochuresDir)) {
          fs.mkdirSync(brochuresDir, { recursive: true });
        }

        // Nonce-based generated safe filename (no path traversal possible)
        const safeId = crypto.randomUUID();
        const filename = `mkm_brochure_${Date.now()}_${safeId}.pdf`;
        const filePath = path.join(brochuresDir, filename);

        await fs.promises.writeFile(filePath, buffer);
        finalUrl = `/brochures/${filename}`;
      } else if (brochureUrlInput) {
        if (!isValidBrochureUrl(brochureUrlInput)) {
          return NextResponse.json(
            { success: false, error: 'Invalid brochure URL. Please provide a valid HTTP/HTTPS link or upload a PDF.' },
            { status: 400 }
          );
        }
        finalUrl = brochureUrlInput.trim();
      }

      if (!finalUrl) {
        return NextResponse.json({ success: false, error: 'Please provide a valid file or brochure URL' }, { status: 400 });
      }

      const updated = await updateProjectBrochures(projectId, finalUrl, finalUrl);
      return NextResponse.json({ success: true, brochureUrl: finalUrl, project: updated });
    } else {
      const body = await req.json();
      const { projectId, brochureUrl, priceBrochureUrl } = body;

      if (!projectId || (!brochureUrl && !priceBrochureUrl)) {
        return NextResponse.json({ success: false, error: 'Missing projectId or brochureUrl' }, { status: 400 });
      }

      const candidateUrl = (priceBrochureUrl || brochureUrl || '').trim();
      if (!isValidBrochureUrl(candidateUrl)) {
        return NextResponse.json(
          { success: false, error: 'Invalid brochure URL format' },
          { status: 400 }
        );
      }

      const updated = await updateProjectBrochures(projectId, candidateUrl, candidateUrl);
      return NextResponse.json({ success: true, brochureUrl: candidateUrl, project: updated });
    }
  } catch (error: any) {
    console.error('[Upload Brochure API] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to upload brochure document' }, { status: 500 });
  }
}
