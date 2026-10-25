import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        phone: session.phone,
        role: session.role,
        status: session.status
      }
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
