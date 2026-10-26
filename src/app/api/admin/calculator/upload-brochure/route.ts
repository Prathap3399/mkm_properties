import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { updateProjectBrochures, getProjectById } from '@/lib/db/repository';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const projectId = formData.get('projectId') as string;
      const file = formData.get('file') as File | null;
      const brochureUrlInput = formData.get('brochureUrl') as string | null;

      if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
      }

      let finalUrl = brochureUrlInput || '';

      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const brochuresDir = path.join(process.cwd(), 'public', 'brochures');
        if (!fs.existsSync(brochuresDir)) {
          fs.mkdirSync(brochuresDir, { recursive: true });
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}_${safeName}`;
        const filePath = path.join(brochuresDir, filename);

        await fs.promises.writeFile(filePath, buffer);
        finalUrl = `/brochures/${filename}`;
      }

      if (!finalUrl) {
        return NextResponse.json({ error: 'Please provide a file or brochure URL' }, { status: 400 });
      }

      const updated = await updateProjectBrochures(projectId, finalUrl, finalUrl);
      return NextResponse.json({ success: true, brochureUrl: finalUrl, project: updated });
    } else {
      const { projectId, brochureUrl, priceBrochureUrl } = await req.json();

      if (!projectId || (!brochureUrl && !priceBrochureUrl)) {
        return NextResponse.json({ error: 'Missing projectId or brochureUrl' }, { status: 400 });
      }

      const finalUrl = priceBrochureUrl || brochureUrl;
      const updated = await updateProjectBrochures(projectId, finalUrl, finalUrl);
      return NextResponse.json({ success: true, brochureUrl: finalUrl, project: updated });
    }
  } catch (error: any) {
    console.error('[Upload Brochure API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
