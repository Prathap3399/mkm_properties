import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { createPlot, updatePlot, deletePlot } from '@/lib/db/repository';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, projectId, sectionCode, plotNumber, areaSqFt, dimensions, facing, roadWidth, status, cornerPremiumPercent, notes } = body;

    if (!projectId || !sectionCode || !plotNumber || !areaSqFt) {
      return NextResponse.json({ error: 'Missing required plot fields' }, { status: 400 });
    }

    if (id) {
      const updated = await updatePlot(id, {
        sectionCode: sectionCode.toUpperCase().trim(),
        plotNumber: String(plotNumber).trim(),
        areaSqFt: Number(areaSqFt),
        dimensions,
        facing,
        roadWidth,
        status,
        cornerPremiumPercent: Number(cornerPremiumPercent || 0),
        notes
      });
      return NextResponse.json({ success: true, plot: updated });
    } else {
      const created = await createPlot({
        projectId,
        sectionCode: sectionCode.toUpperCase().trim(),
        plotNumber: String(plotNumber).trim(),
        areaSqFt: Number(areaSqFt),
        dimensions: dimensions || null,
        facing: facing || 'East Facing',
        roadWidth: roadWidth || '30 ft',
        status: status || 'Available',
        cornerPremiumPercent: Number(cornerPremiumPercent || 0),
        notes: notes || null
      });
      return NextResponse.json({ success: true, plot: created });
    }
  } catch (error: any) {
    console.error('[Plot Save API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Plot ID required' }, { status: 400 });
    }

    const deleted = await deletePlot(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    console.error('[Plot Delete API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
