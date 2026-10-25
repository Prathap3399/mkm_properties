import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminSession } from '@/lib/auth/session';
import { getUserById, updateUser, deleteUser } from '@/lib/db/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const user = await getUserById(id);
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
    updates.passwordHash = await bcrypt.hash(body.password, 10);
  }

  const updated = await updateUser(id, updates);
  return NextResponse.json({ success: true, user: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await deleteUser(id);
  return NextResponse.json({ success: true, message: 'User deleted successfully' });
}
