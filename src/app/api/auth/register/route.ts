import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserByPhone, ensureSeeded } from '@/lib/db/repository';
import { normalizeIndianPhone } from '@/lib/validation/enquiry';

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const { name, email, phone, whatsapp, password, preferredLocation, purpose } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, mobile number, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeIndianPhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingByEmail = await getUserByEmail(cleanEmail);
    if (existingByEmail) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please login.' },
        { status: 409 }
      );
    }

    const existingByPhone = await getUserByPhone(normalizedPhone);
    if (existingByPhone) {
      return NextResponse.json(
        { success: false, error: 'An account with this mobile number already exists. Please login.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: normalizedPhone,
      whatsapp: whatsapp ? normalizeIndianPhone(whatsapp) || whatsapp : normalizedPhone,
      passwordHash,
      role: 'user',
      status: 'PENDING', // PENDING ADMIN APPROVAL!
      notes: `Self-registered via Portal. Preferred Location: ${preferredLocation || 'Not specified'}. Purpose: ${purpose || 'Not specified'}.`
    });

    return NextResponse.json({
      success: true,
      message: 'Registration received! Your account is currently PENDING admin approval. Our property advisor will verify your details and activate your access shortly.',
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        status: user?.status
      }
    });
  } catch (error: any) {
    console.error('[Auth Register] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create registration request' }, { status: 500 });
  }
}
