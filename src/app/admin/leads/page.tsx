import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import { getEnquiries, getAllProjects } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import LeadsManagerClient from '@/components/admin/LeadsManagerClient';

export const instant = false;

export default async function AdminLeadsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const enquiries = await getEnquiries({ limit: 1000 });
  const projects = await getAllProjects({ publishedOnly: false });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Enquiry Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inspect verified leads, track follow-up progress, schedule site visits, and export data.
            </p>
          </div>
        </div>

        <LeadsManagerClient initialEnquiries={enquiries} projects={projects} />
      </main>
    </div>
  );
}
