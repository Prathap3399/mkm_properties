import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getEnquiryById, updateEnquiryStatus, approveLeadToUser, addFollowUp } from '@/lib/db/repository';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const enquiry = await getEnquiryById(id);
  if (!enquiry) {
    return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, enquiry });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, action, password, note, scheduledDate, scheduledTime } = body;

  // 1. Action: Approve Lead & Grant User Access
  if (action === 'approve_user') {
    try {
      const approvalResult = await approveLeadToUser(id, password || 'MKMClient@2026!');
      const updated = await getEnquiryById(id);
      return NextResponse.json({
        success: true,
        message: 'Lead approved! Client portal account created.',
        enquiry: updated,
        credentials: {
          email: approvalResult.userEmail,
          password: approvalResult.initialPassword
        }
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  // 2. Action: Schedule Site Visit
  if (action === 'schedule_visit') {
    const visitNote = `Site visit scheduled for ${scheduledDate || 'selected date'} at ${scheduledTime || 'selected time'}. Note: ${note || 'Confirmed with customer.'}`;
    await updateEnquiryStatus(id, 'SCHEDULED');
    await addFollowUp(id, visitNote, scheduledDate);
    const updated = await getEnquiryById(id);
    return NextResponse.json({ success: true, message: 'Site visit scheduled', enquiry: updated });
  }

  // 3. Regular Status Update
  const validStatuses = [
    'PENDING',
    'NEW',
    'CONTACTED',
    'SCHEDULED',
    'SITE_VISIT',
    'COMPLETED',
    'FOLLOW_UP',
    'CONVERTED',
    'NOT_INTERESTED',
    'REJECTED',
    'APPROVED'
  ];

  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ success: false, error: 'Invalid lead status' }, { status: 400 });
  }

  const updated = await updateEnquiryStatus(id, status, note);
  return NextResponse.json({ success: true, enquiry: updated });
}
