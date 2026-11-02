import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db/repository';
import { getUserSession, getAdminSession } from '@/lib/auth/session';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  // Enforce server-side authorization: Never expose private property information through public APIs!
  const userSession = await getUserSession();
  if (!userSession || (userSession.status !== 'APPROVED' && userSession.role !== 'admin')) {
    await logSecurityEvent({
      eventType: 'ACCESS_DENIED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/projects', method: 'GET' },
      status: 'BLOCKED'
    });
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Complete project portfolio is restricted to authorized clients.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  // If fetching unpublished projects, require admin
  if (all) {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin role required' }, { status: 401 });
    }
    const projects = await getAllProjects({ publishedOnly: false });
    return NextResponse.json({ success: true, projects });
  }

  const projects = await getAllProjects({ publishedOnly: true });
  return NextResponse.json({ success: true, projects });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  const ip = getClientIp(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      location,
      description,
      coverImageUrl,
      galleryUrls,
      videoUrl,
      brochureUrl,
      priceLabel,
      approvalStatus,
      availabilityStatus,
      isPublished,
      plotSizes,
      roadAccess,
      nearbyLandmarks,
      amenities,
      mapUrl
    } = body;

    if (!name || !slug || !location || !description || !coverImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, location, description, and cover image are required' },
        { status: 400 }
      );
    }

    const created = await createProject({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      location: location.trim(),
      description: description.trim(),
      coverImageUrl: coverImageUrl.trim(),
      galleryUrls: typeof galleryUrls === 'string' ? galleryUrls : JSON.stringify(galleryUrls || []),
      videoUrl: videoUrl || null,
      brochureUrl: brochureUrl || null,
      priceLabel: priceLabel || null,
      approvalStatus: approvalStatus || null,
      availabilityStatus: availabilityStatus || 'Available',
      isPublished: isPublished === 0 ? 0 : 1,
      plotSizes: plotSizes || null,
      roadAccess: roadAccess || null,
      nearbyLandmarks: nearbyLandmarks || null,
      amenities: typeof amenities === 'string' ? amenities : JSON.stringify(amenities || []),
      mapUrl: mapUrl || null
    });

    await logSecurityEvent({
      eventType: 'USER_ROLE_CHANGE',
      severity: 'INFO',
      actorId: session.id,
      actorEmail: session.email,
      ipAddress: ip,
      details: { action: 'create_project', projectId: created?.id, slug: created?.slug },
      status: 'SUCCESS'
    });

    return NextResponse.json({ success: true, project: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
