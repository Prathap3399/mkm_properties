import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getEnquiries } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
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
    `"${e.id}"`,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.phone || '').replace(/"/g, '""')}"`,
    `"${(e.email || '').replace(/"/g, '""')}"`,
    `"${(e.projectName || 'General Enquiry').replace(/"/g, '""')}"`,
    `"${(e.purpose || '').replace(/"/g, '""')}"`,
    `"${(e.budget || '').replace(/"/g, '""')}"`,
    `"${(e.preferredLocation || '').replace(/"/g, '""')}"`,
    `"${(e.preferredVisitDate || '').replace(/"/g, '""')}"`,
    `"${e.status}"`,
    `"${e.source || 'Website'}"`,
    `"${e.utmSource || ''}"`,
    `"${e.utmCampaign || ''}"`,
    `"${e.consentAt}"`,
    `"${e.createdAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const filename = `mkm_leads_${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
