import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getAllProjects, getSectionsByProjectId, getPlotsByProjectId } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await getAllProjects();

    const data = await Promise.all(
      projects.map(async (p) => {
        const sections = await getSectionsByProjectId(p.id);
        const plots = await getPlotsByProjectId(p.id);
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          location: p.location,
          priceLabel: p.priceLabel,
          brochureUrl: p.brochureUrl,
          priceBrochureUrl: p.priceBrochureUrl || p.brochureUrl,
          approvalStatus: p.approvalStatus,
          sections,
          plots
        };
      })
    );

    return NextResponse.json({ success: true, projects: data });
  } catch (error: any) {
    if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.message?.includes('prerender')) {
      throw error;
    }
    console.error('[Calculator API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
