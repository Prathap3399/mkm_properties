import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import { getAllDocuments, getAllProjects } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import DocumentsManagerClient from '@/components/admin/DocumentsManagerClient';

export const instant = false;

export default async function AdminDocumentsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const documents = await getAllDocuments();
  const projects = await getAllProjects({ publishedOnly: false });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Protected Document &amp; Brochure Library Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload, categorize, replace, or delete layout drawings, DTCP approvals, and promoter price sheets.
          </p>
        </div>

        <DocumentsManagerClient initialDocuments={documents} projects={projects} />
      </main>
    </div>
  );
}
