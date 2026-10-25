import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import { getAllUsers } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import UsersManagerClient from '@/components/admin/UsersManagerClient';

export const instant = false;

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const users = await getAllUsers();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Access &amp; Authorization Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control which verified leads and clients can access proprietary project blueprints, DTCP approvals, and download documents.
          </p>
        </div>

        <UsersManagerClient initialUsers={users} />
      </main>
    </div>
  );
}
