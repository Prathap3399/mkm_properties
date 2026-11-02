import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/repository';
import { getAdminSession, getUserSession } from '@/lib/auth/session';
import { logSecurityEvent } from '@/lib/security/audit';
import { getClientIp } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getUserSession();
  const ip = getClientIp(req);

  if (!session || (session.status !== 'APPROVED' && session.role !== 'admin')) {
    await logSecurityEvent({
      eventType: 'ACCESS_DENIED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/projects/[id]', method: 'GET' },
      status: 'BLOCKED'
    });
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Approved client or administrator credentials required.' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  // Unpublished project visibility restricted strictly to administrators
  if (project.isPublished === 0 && session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  const ip = getClientIp(req);

  if (!session) {
    await logSecurityEvent({
      eventType: 'ACCESS_DENIED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/projects/[id]', method: 'PUT' },
      status: 'BLOCKED'
    });
    return NextResponse.json({ success: false, error: 'Unauthorized: Administrator access required' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await updateProject(id, body);
  return NextResponse.json({ success: true, project: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  const ip = getClientIp(req);

  if (!session) {
    await logSecurityEvent({
      eventType: 'ACCESS_DENIED',
      severity: 'WARN',
      ipAddress: ip,
      details: { endpoint: '/api/projects/[id]', method: 'DELETE' },
      status: 'BLOCKED'
    });
    return NextResponse.json({ success: false, error: 'Unauthorized: Administrator access required' }, { status: 401 });
  }

  const { id } = await params;
  await deleteProject(id);

  await logSecurityEvent({
    eventType: 'USER_ROLE_CHANGE',
    severity: 'INFO',
    actorId: session.id,
    actorEmail: session.email,
    ipAddress: ip,
    details: { action: 'delete_project', projectId: id },
    status: 'SUCCESS'
  });

  return NextResponse.json({ success: true, message: 'Project deleted' });
}
