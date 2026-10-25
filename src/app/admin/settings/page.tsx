import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/session';
import AdminNav from '@/components/admin/AdminNav';
import { Settings, ShieldCheck, KeyRound, Bell, Database } from 'lucide-react';

export const instant = false;

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal &amp; Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System configuration, notification preferences, and administrative security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Credentials Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
              <KeyRound className="w-5 h-5 text-emerald-800" />
              <span>Admin Authentication</span>
            </div>
            <p className="text-xs text-slate-500">
              Active Administrator Session details.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Administrator Email</span>
                <span className="font-mono font-bold text-slate-800">{session.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Role</span>
                <span className="font-bold text-emerald-800 uppercase">{session.role}</span>
              </div>
            </div>
          </div>

          {/* Lead Notification Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>Lead Notification Channels</span>
            </div>
            <p className="text-xs text-slate-500">
              Notification hooks triggered upon receiving new site visit requests.
            </p>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span>Email Notifications (Resend API)</span>
                <span className="badge badge-sm bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                  ENABLED
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span>Meta CAPI Server Attribution</span>
                <span className="badge badge-sm bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span>WhatsApp Lead Alert Hook</span>
                <span className="badge badge-sm bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                  DIRECT WA LINK
                </span>
              </div>
            </div>
          </div>

          {/* Controlled Access Policy */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[#0b4632]" />
              <span>Controlled-Access Business Rule</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This portal strictly operates under the <strong>Controlled Access Real Estate Architecture</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="block text-slate-900 mb-1">1. Public Layer</strong>
                <span className="text-slate-500">
                  Site Visit booking, Who We Are philosophy, and contact details only. Project blueprints and prices are hidden.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="block text-slate-900 mb-1">2. Lead Verification</strong>
                <span className="text-slate-500">
                  Every enquiry lands in Admin with status PENDING. Admin verifies customer intent and approves user access.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="block text-slate-900 mb-1">3. Authorized Portal</strong>
                <span className="text-slate-500">
                  Only approved clients can view /projects, download DTCP documents, and review price sheets.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
