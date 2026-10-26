import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { createOrUpdateSection } from '@/lib/db/repository';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, sectionCode, sectionName, pricePerSqFt, roadWidth, description } = body;

    if (!projectId || !sectionCode || pricePerSqFt === undefined) {
      return NextResponse.json({ error: 'Missing required section fields' }, { status: 400 });
    }

    const section = await createOrUpdateSection({
      projectId,
      sectionCode: sectionCode.toUpperCase().trim(),
      sectionName: sectionName || `Section ${sectionCode.toUpperCase()}`,
      pricePerSqFt: Number(pricePerSqFt),
      roadWidth: roadWidth || '30 ft',
      description: description || ''
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    console.error('[Section Update API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
