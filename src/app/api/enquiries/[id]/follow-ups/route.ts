import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { addFollowUp, getFollowUps } from '@/lib/db/repository';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const followUps = await getFollowUps(id);
  return NextResponse.json({ success: true, followUps });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { note, nextFollowUpAt } = body;

  if (!note || note.trim().length === 0) {
    return NextResponse.json({ success: false, error: 'Note cannot be empty' }, { status: 400 });
  }

  const createdBy = `${session.email} (Admin)`;
  const record = await addFollowUp(id, note.trim(), nextFollowUpAt || null, createdBy);

  return NextResponse.json({ success: true, followUp: record });
}
