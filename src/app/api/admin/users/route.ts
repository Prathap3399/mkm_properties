import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminSession } from '@/lib/auth/session';
import { getAllUsers, createUser, getUserByEmail, getUserByPhone } from '@/lib/db/repository';

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

    const cleanEmail = email.trim().toLowerCase();
    const existing = await getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      whatsapp: whatsapp || phone.trim(),
      passwordHash,
      role: role || 'user',
      status: status || 'APPROVED',
      notes: notes || 'Created manually by Admin'
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
