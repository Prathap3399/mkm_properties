import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserByPhone, ensureSeeded } from '@/lib/db/repository';
import { normalizeIndianPhone } from '@/lib/validation/enquiry';
import { getClientIp, checkRateLimit, RATE_LIMITS } from '@/lib/security/rateLimit';
import { logSecurityEvent } from '@/lib/security/audit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate Limiting
  const rateLimit = checkRateLimit(ip, RATE_LIMITS.REGISTER);
  if (!rateLimit.allowed) {
    await logSecurityEvent({
      eventType: 'RATE_LIMIT_TRIGGERED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/auth/register' },
      status: 'BLOCKED'
    });
    return NextResponse.json(
      {
        success: false,
        error: `Too many registration attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`
      },
      { status: 429 }
    );
  }

  try {
    await ensureSeeded();
    const body = await req.json();
    const { name, email, phone, whatsapp, password, preferredLocation, purpose } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, mobile number, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long for account security' },
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if user already exists (unified message against account enumeration)
    const existingByEmail = await getUserByEmail(cleanEmail);
    const existingByPhone = await getUserByPhone(normalizedPhone);

    if (existingByEmail || existingByPhone) {
      return NextResponse.json(
        { success: false, error: 'An account with these contact details already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Strictly enforce role and status on the server!
    const user = await createUser({
      name: name.trim(),
      email: cleanEmail,
      phone: normalizedPhone,
      whatsapp: whatsapp ? normalizeIndianPhone(whatsapp) || whatsapp : normalizedPhone,
      passwordHash,
      role: 'user', // Always user, never admin
      status: 'PENDING', // PENDING ADMIN APPROVAL!
      notes: `Self-registered via Portal. Preferred Location: ${preferredLocation || 'Not specified'}. Purpose: ${purpose || 'Not specified'}.`
    });

    await logSecurityEvent({
      eventType: 'AUTH_REGISTER',
      severity: 'INFO',
      actorId: user?.id,
      actorEmail: cleanEmail,
      ipAddress: ip,
      details: { role: 'user', status: 'PENDING' },
      status: 'SUCCESS'
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
    console.error('[Auth Register] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to process registration request' }, { status: 500 });
  }
}
