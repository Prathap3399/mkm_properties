import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { createOrUpdateSection } from '@/lib/db/repository';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, sectionCode, sectionName, pricePerSqFt, roadWidth, description } = body;

    if (!projectId || !sectionCode || pricePerSqFt === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required section fields' }, { status: 400 });
    }

    const numPrice = Number(pricePerSqFt);
    if (!Number.isFinite(numPrice) || numPrice < 0 || numPrice > 1000000) {
      return NextResponse.json({ success: false, error: 'Price per sq.ft must be a valid positive number' }, { status: 400 });
    }

    const cleanSectionCode = String(sectionCode).toUpperCase().trim();
    if (cleanSectionCode.length === 0 || cleanSectionCode.length > 10) {
      return NextResponse.json({ success: false, error: 'Section code must be between 1 and 10 characters' }, { status: 400 });
    }

    const section = await createOrUpdateSection({
      projectId,
      sectionCode: cleanSectionCode,
      sectionName: sectionName ? String(sectionName).trim().slice(0, 50) : `Section ${cleanSectionCode}`,
      pricePerSqFt: numPrice,
      roadWidth: roadWidth ? String(roadWidth).trim().slice(0, 30) : '30 ft',
      description: description ? String(description).trim().slice(0, 200) : ''
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    console.error('[Section Update API] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to update section' }, { status: 500 });
  }
}
