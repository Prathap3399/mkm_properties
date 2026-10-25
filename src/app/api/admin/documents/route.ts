import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getAllDocuments, createDocument } from '@/lib/db/repository';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const projectId = searchParams.get('projectId') || undefined;
  const search = searchParams.get('search') || undefined;

  const documents = await getAllDocuments({ category, projectId, search });
  return NextResponse.json({ success: true, documents });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, category, fileUrl, fileSize, projectId, isProtected } = body;

    if (!title || !category || !fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and file URL are required' },
        { status: 400 }
      );
    }

    const doc = await createDocument({
      title: title.trim(),
      description: description || null,
      category,
      fileUrl: fileUrl.trim(),
      fileSize: fileSize || '1.5 MB',
      fileType: 'pdf',
      projectId: projectId || null,
      isProtected: isProtected !== undefined ? isProtected : 1
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
