import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import { getAllSiteContents } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import ContentManagerClient from '@/components/admin/ContentManagerClient';

export const instant = false;

export default async function AdminContentPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const contents = await getAllSiteContents();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dynamic Website Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update About Us philosophy, Contact details, Buyer guidelines, and Homepage messaging in real-time without modifying code.
          </p>
        </div>

        <ContentManagerClient initialContents={contents} />
      </main>
    </div>
  );
}
