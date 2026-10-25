import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import { getAllProjects } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import ProjectsManagerClient from '@/components/admin/ProjectsManagerClient';

export default async function AdminProjectsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const projects = await getAllProjects({ publishedOnly: false });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Property Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add new residential layouts, update plot pricing, upload brochures, and toggle public visibility.
          </p>
        </div>

        <ProjectsManagerClient initialProjects={projects} />
      </main>
    </div>
  );
}
