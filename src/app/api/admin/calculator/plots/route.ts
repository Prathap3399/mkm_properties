import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { createPlot, updatePlot, deletePlot } from '@/lib/db/repository';

const VALID_STATUSES = new Set(['Available', 'Booked', 'Sold']);

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, projectId, sectionCode, plotNumber, areaSqFt, dimensions, facing, roadWidth, status, cornerPremiumPercent, notes } = body;

    if (!projectId || !sectionCode || !plotNumber || !areaSqFt) {
      return NextResponse.json({ success: false, error: 'Missing required plot fields' }, { status: 400 });
    }

    const numArea = Number(areaSqFt);
    if (!Number.isFinite(numArea) || numArea <= 0 || numArea > 100000) {
      return NextResponse.json({ success: false, error: 'Plot area must be a valid positive number' }, { status: 400 });
    }

    const numPremium = Number(cornerPremiumPercent || 0);
    if (!Number.isFinite(numPremium) || numPremium < 0 || numPremium > 100) {
      return NextResponse.json({ success: false, error: 'Corner premium percent must be between 0 and 100' }, { status: 400 });
    }

    const plotStatus = status && VALID_STATUSES.has(status) ? status : 'Available';

    if (id) {
      const updated = await updatePlot(id, {
        sectionCode: sectionCode.toUpperCase().trim(),
        plotNumber: String(plotNumber).trim(),
        areaSqFt: numArea,
        dimensions: dimensions ? String(dimensions).trim().slice(0, 50) : null,
        facing: facing ? String(facing).trim().slice(0, 30) : 'East Facing',
        roadWidth: roadWidth ? String(roadWidth).trim().slice(0, 30) : '30 ft',
        status: plotStatus,
        cornerPremiumPercent: numPremium,
        notes: notes ? String(notes).trim().slice(0, 200) : null
      });
      return NextResponse.json({ success: true, plot: updated });
    } else {
      const created = await createPlot({
        projectId,
        sectionCode: sectionCode.toUpperCase().trim(),
        plotNumber: String(plotNumber).trim(),
        areaSqFt: numArea,
        dimensions: dimensions ? String(dimensions).trim().slice(0, 50) : null,
        facing: facing ? String(facing).trim().slice(0, 30) : 'East Facing',
        roadWidth: roadWidth ? String(roadWidth).trim().slice(0, 30) : '30 ft',
        status: plotStatus,
        cornerPremiumPercent: numPremium,
        notes: notes ? String(notes).trim().slice(0, 200) : null
      });
      return NextResponse.json({ success: true, plot: created });
    }
  } catch (error: any) {
    console.error('[Plot Save API] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to save plot' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Plot ID required' }, { status: 400 });
    }

    const deleted = await deletePlot(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    console.error('[Plot Delete API] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to delete plot' }, { status: 500 });
  }
}
