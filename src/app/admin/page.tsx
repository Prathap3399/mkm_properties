import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth/session';
import { getEnquiries, getAllProjects, getAllUsers, getAllDocuments } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import {
  Users,
  CalendarCheck,
  CheckCircle,
  Building2,
  ArrowRight,
  TrendingUp,
  Download,
  PlusCircle,
  Phone,
  Clock,
  UserCheck,
  XCircle,
  ShieldAlert,
  FolderDown,
  Car
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export const instant = false;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const allLeads = await getEnquiries({ limit: 1000 });
  const allProjects = await getAllProjects({ publishedOnly: false });
  const allUsers = await getAllUsers();
  const allDocs = await getAllDocuments();

  // Metrics required by Prompt Section 8:
  const totalLeads = allLeads.length;
  const pendingLeads = allLeads.filter((l) => l.status === 'PENDING' || l.status === 'NEW').length;
  const scheduledVisits = allLeads.filter((l) => l.status === 'SCHEDULED' || l.status === 'SITE_VISIT').length;
  const completedVisits = allLeads.filter((l) => l.status === 'COMPLETED').length;
  const rejectedLeads = allLeads.filter((l) => l.status === 'REJECTED').length;

  const approvedUsers = allUsers.filter((u) => u.status === 'APPROVED').length;
  const activeUsers = allUsers.filter((u) => u.status === 'APPROVED' && u.role === 'user').length;

  const recentLeads = allLeads.slice(0, 6);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome & Quick Action Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Real Estate Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Controlled access lead verification, site visit scheduling, and client authorization portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/api/enquiries/export"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </a>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Manage Users</span>
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b4632] text-[#fef9c3] hover:bg-[#06281d] font-bold text-xs transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Add Project</span>
            </Link>
          </div>
        </div>

        {/* 7 KPI Metric Cards per Section 8 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Leads
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalLeads}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">All enquiries</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Pending Leads
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingLeads}</div>
            <span className="text-[10px] text-amber-600/80 mt-0.5 block">Needs review</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Approved Users
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{approvedUsers}</div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Portal access</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Visits Scheduled
            </span>
            <div className="text-2xl font-black text-blue-600 mt-1">{scheduledVisits}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Upcoming cab</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
              Visits Done
            </span>
            <div className="text-2xl font-black text-purple-600 mt-1">{completedVisits}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Inspected</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
              Rejected Leads
            </span>
            <div className="text-2xl font-black text-red-600 mt-1">{rejectedLeads}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Disqualified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Active Users
            </span>
            <div className="text-2xl font-black text-slate-800 mt-1">{activeUsers}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Client portal</span>
          </div>
        </div>

        {/* Recent Site Visit Enquiries with Approval Action */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Site Visit Enquiries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review visitor requests, verify location &amp; budget, and grant client portal credentials.
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              <span>Manage All ({totalLeads}) Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Visitor / Phone</th>
                  <th className="py-3 px-4">Preferred Corridor</th>
                  <th className="py-3 px-4">Purpose &amp; Budget</th>
                  <th className="py-3 px-4">Visit Date &amp; Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No site visit enquiries received yet.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="font-mono text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {lead.preferredLocation || 'Trichy General'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold">{lead.purpose}</div>
                        <div className="text-slate-500 text-[11px]">{lead.budget || 'Standard Range'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-800 font-medium">
                          {lead.preferredVisitDate || 'Flexible'}
                        </div>
                        <div className="text-[10px] text-slate-500">{lead.preferredTime || 'Any Time'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            lead.status === 'PENDING' || lead.status === 'NEW'
                              ? 'bg-amber-100 text-amber-900'
                              : lead.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-900'
                              : lead.status === 'SCHEDULED' || lead.status === 'SITE_VISIT'
                              ? 'bg-blue-100 text-blue-900'
                              : lead.status === 'COMPLETED'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/leads?id=${lead.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">User Management</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Approve, reject, disable or reset credentials for client portal users.
              </p>
            </div>
            <Link
              href="/admin/users"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
            >
              <span>Manage {allUsers.length} Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Project Management</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Add, edit, or update layout details, plot dimensions, pricing, and amenities.
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:underline"
            >
              <span>Manage {allProjects.length} Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-3">
                <FolderDown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Document Management</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upload layout drawings, DTCP approvals, brochures, and price sheets.
              </p>
            </div>
            <Link
              href="/admin/documents"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:underline"
            >
              <span>Manage {allDocs.length} Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
