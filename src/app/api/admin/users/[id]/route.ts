import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminSession } from '@/lib/auth/session';
import { getUserByIdSafe, updateUser, deleteUser } from '@/lib/db/repository';
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
  const user = await getUserByIdSafe(id);
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
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
  const updates: any = {};

  if (body.status) updates.status = body.status;
  if (body.role) updates.role = body.role;
  if (body.name) updates.name = body.name;
  if (body.phone) updates.phone = body.phone;
  if (body.notes) updates.notes = body.notes;

  if (body.password) {
    if (body.password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    updates.passwordHash = await bcrypt.hash(body.password, 12);
  }

  const updated = await updateUser(id, updates);

  await logSecurityEvent({
    eventType: body.role ? 'USER_ROLE_CHANGE' : 'USER_STATUS_CHANGE',
    severity: 'INFO',
    actorId: session.id,
    actorEmail: session.email,
    ipAddress: ip,
    details: { targetUserId: id, status: body.status, role: body.role },
    status: 'SUCCESS'
  });

  return NextResponse.json({ success: true, user: updated });
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
  await deleteUser(id);

  await logSecurityEvent({
    eventType: 'USER_STATUS_CHANGE',
    severity: 'WARN',
    actorId: session.id,
    actorEmail: session.email,
    ipAddress: ip,
    details: { action: 'delete_user', targetUserId: id },
    status: 'SUCCESS'
  });

  return NextResponse.json({ success: true, message: 'User deleted successfully' });
}
