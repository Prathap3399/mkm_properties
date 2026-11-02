import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminSession } from '@/lib/auth/session';
import { getAllUsers, createUser, getUserByEmail, getUserByPhone } from '@/lib/db/repository';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const role = searchParams.get('role') || undefined;
  const search = searchParams.get('search') || undefined;

  const users = await getAllUsers({ status, role, search });
  return NextResponse.json({ success: true, users });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  const ip = getClientIp(req);

  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, whatsapp, password, role, status, notes } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, mobile, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const cleanPhone = phone.trim();
    const existingPhone = await getUserByPhone(cleanPhone);
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'User with this mobile number already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      whatsapp: whatsapp || cleanPhone,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'user',
      status: status || 'APPROVED',
      notes: notes || 'Created manually by Admin'
    });

    await logSecurityEvent({
      eventType: 'AUTH_REGISTER',
      severity: 'INFO',
      actorId: session.id,
      actorEmail: session.email,
      ipAddress: ip,
      details: { action: 'admin_create_user', targetEmail: cleanEmail, assignedRole: role || 'user' },
      status: 'SUCCESS'
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    console.error('[Admin User Create] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
