import { NextRequest, NextResponse } from 'next/server';
import { EnquirySchema, normalizeIndianPhone } from '@/lib/validation/enquiry';
import { createEnquiry, getEnquiries, getProjectById } from '@/lib/db/repository';
import { sendEnquiryNotification } from '@/lib/email/resend';
import { sendMetaCapiEvent } from '@/lib/analytics/meta';
import { getAdminSession } from '@/lib/auth/session';

// Simple in-memory rate limiter for serverless environment
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  if (now - record.firstSeen > windowMs) {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
    return false;
  }

  record.count += 1;
  return record.count > maxRequests;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute or call 9629048171 directly.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Check anti-bot honeypot
    if (body.botField && body.botField.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Site visit enquiry received' });
    }

    // 2. Validate input with Zod
    const validationResult = EnquirySchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid form data';
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const data = validationResult.data;

    // 3. Normalize Indian phone
    const normalizedPhone = normalizeIndianPhone(data.phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    const normalizedWhatsapp = data.whatsapp ? normalizeIndianPhone(data.whatsapp) || data.whatsapp : normalizedPhone;

    // 4. Resolve project details if a valid ID was chosen
    let resolvedProjectId: string | null = null;
    let resolvedProjectName: string | null = null;

    if (data.projectId && data.projectId !== 'General Enquiry' && data.projectId !== 'any') {
      const proj = await getProjectById(data.projectId);
      if (proj) {
        resolvedProjectId = proj.id;
        resolvedProjectName = proj.name;
      }
    }

    // Map purpose to standard type
    const mappedPurpose = data.purpose === 'Build a House' ? 'Build a House' : (data.purpose as any);

    // 5. Persist enquiry into database
    const savedEnquiry = await createEnquiry({
      name: data.name,
      phone: normalizedPhone,
      whatsapp: normalizedWhatsapp,
      email: data.email || null,
      projectId: resolvedProjectId,
      purpose: mappedPurpose,
      budget: data.budget || null,
      preferredLocation: data.preferredLocation || null,
      preferredVisitDate: data.preferredVisitDate || null,
      preferredTime: data.preferredTime || null,
      hearAboutUs: data.hearAboutUs || null,
      additionalRequirements: data.additionalRequirements || null,
      message: data.message || data.additionalRequirements || null,
      source: 'Site Visit Form',
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmContent: data.utmContent || null,
      utmTerm: data.utmTerm || null,
      privacyPolicyVersion: data.privacyPolicyVersion || 'v1.0'
    });

    if (!savedEnquiry) {
      throw new Error('Failed to save site visit enquiry');
    }

    // 6. Secondary Action A: Trigger Email Notification (error resilient)
    try {
      await sendEnquiryNotification({
        enquiryId: savedEnquiry.id,
        name: savedEnquiry.name,
        phone: savedEnquiry.phone,
        email: savedEnquiry.email,
        projectName: resolvedProjectName || savedEnquiry.preferredLocation || 'General Trichy Plots',
        purpose: savedEnquiry.purpose,
        budget: savedEnquiry.budget,
        preferredLocation: savedEnquiry.preferredLocation,
        purchaseTimeline: savedEnquiry.preferredTime,
        preferredVisitDate: savedEnquiry.preferredVisitDate,
        message: savedEnquiry.additionalRequirements || savedEnquiry.message,
        utmSource: savedEnquiry.utmSource,
        utmMedium: savedEnquiry.utmMedium,
        utmCampaign: savedEnquiry.utmCampaign,
        createdAt: savedEnquiry.createdAt
      });
    } catch (emailErr) {
      console.error('[Enquiry API] Non-fatal notification failure:', emailErr);
    }

    // 7. Secondary Action B: Meta Conversions API Server Event
    const eventId = body.eventId || `lead_${savedEnquiry.id}`;
    try {
      await sendMetaCapiEvent({
        eventName: 'Lead',
        eventId,
        eventSourceUrl: req.headers.get('referer') || 'https://mkmproperties.com/site-visit',
        userData: {
          email: savedEnquiry.email,
          phone: savedEnquiry.phone,
          clientIpAddress: ip,
          clientUserAgent: req.headers.get('user-agent') || ''
        },
        customData: {
          contentName: resolvedProjectName || savedEnquiry.preferredLocation || 'Site Visit Enquiry',
          contentCategory: savedEnquiry.purpose,
          projectId: savedEnquiry.projectId || undefined
        }
      });
    } catch (metaErr) {
      console.error('[Enquiry API] Non-fatal Meta CAPI failure:', metaErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your enquiry. Our team will contact you shortly to confirm your site visit.',
      enquiryId: savedEnquiry.id
    });
  } catch (error: any) {
    console.error('[Enquiry API] Critical Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please call 9629048171 directly.' },
      { status: 500 }
    );
  }
}

// Authenticated GET for Admin
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const projectId = searchParams.get('projectId') || undefined;
  const search = searchParams.get('search') || undefined;
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const enquiries = await getEnquiries({
    status,
    projectId,
    search,
    limit,
    offset
  });

  return NextResponse.json({ success: true, enquiries });
}
