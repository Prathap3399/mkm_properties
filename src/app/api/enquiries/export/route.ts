import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getEnquiries } from '@/lib/db/repository';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

// Neutralizes CSV Formula Injection (OWASP formula injection prevention)
function sanitizeCsvCell(val: string | null | undefined): string {
  if (!val) return '""';
  let clean = String(val);
  // If the cell begins with formula execution characters, prepend with single quote
  if (/^[=+\-@\t\r\n]/.test(clean)) {
    clean = `'${clean}`;
  }
  return `"${clean.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  const ip = getClientIp(req);

  if (!session) {
    await logSecurityEvent({
      eventType: 'ACCESS_DENIED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/enquiries/export' },
      status: 'BLOCKED'
    });
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const projectId = searchParams.get('projectId') || undefined;

  const enquiries = await getEnquiries({
    status,
    projectId,
    limit: 1000 // export up to 1000 records
  });

  const headers = [
    'Enquiry ID',
    'Customer Name',
    'Mobile Phone',
    'Email',
    'Project Name',
    'Purpose',
    'Budget',
    'Preferred Location',
    'Preferred Visit Date',
    'Status',
    'Source',
    'UTM Source',
    'UTM Campaign',
    'Consent At',
    'Submitted At'
  ];

  const rows = enquiries.map((e) => [
    sanitizeCsvCell(e.id),
    sanitizeCsvCell(e.name),
    sanitizeCsvCell(e.phone),
    sanitizeCsvCell(e.email),
    sanitizeCsvCell(e.projectName || 'General Enquiry'),
    sanitizeCsvCell(e.purpose),
    sanitizeCsvCell(e.budget),
    sanitizeCsvCell(e.preferredLocation),
    sanitizeCsvCell(e.preferredVisitDate),
    sanitizeCsvCell(e.status),
    sanitizeCsvCell(e.source || 'Website'),
    sanitizeCsvCell(e.utmSource),
    sanitizeCsvCell(e.utmCampaign),
    sanitizeCsvCell(e.consentAt),
    sanitizeCsvCell(e.createdAt)
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const filename = `mkm_leads_${new Date().toISOString().split('T')[0]}.csv`;

  await logSecurityEvent({
    eventType: 'DOCUMENT_DOWNLOAD',
    severity: 'INFO',
    actorId: session.id,
    actorEmail: session.email,
    ipAddress: ip,
    details: { exportType: 'leads_csv', recordCount: enquiries.length },
    status: 'SUCCESS'
  });

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-cache, no-store, must-revalidate'
    }
  });
}
