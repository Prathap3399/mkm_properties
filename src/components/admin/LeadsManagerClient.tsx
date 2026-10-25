'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  X,
  FileText,
  User,
  ShieldCheck,
  UserCheck,
  Car,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { EnquiryRecord, FollowUpRecord, ProjectRecord } from '@/lib/db/repository';

interface Props {
  initialEnquiries: EnquiryRecord[];
  projects: ProjectRecord[];
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending (New)' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'SCHEDULED', label: 'Site Visit Scheduled' },
  { value: 'COMPLETED', label: 'Site Visit Completed' },
  { value: 'FOLLOW_UP', label: 'Follow-Up' },
  { value: 'APPROVED', label: 'User Access Approved' },
  { value: 'CONVERTED', label: 'Converted / Booked' },
  { value: 'REJECTED', label: 'Rejected' }
];

export default function LeadsManagerClient({ initialEnquiries, projects }: Props) {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(initialEnquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  // Selected lead modal state
  const [selectedLead, setSelectedLead] = useState<EnquiryRecord | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Follow-ups state
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Approval credentials modal state
  const [approvedCredentials, setApprovedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [approvingUser, setApprovingUser] = useState(false);

  // Filter leads
  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.preferredLocation && e.preferredLocation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      e.status === statusFilter ||
      (statusFilter === 'PENDING' && (e.status === 'NEW' || e.status === 'PENDING'));

    const matchesProject =
      projectFilter === 'ALL' ||
      e.projectId === projectFilter ||
      e.projectName === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const openLeadDetails = async (lead: EnquiryRecord) => {
    setSelectedLead(lead);
    setSelectedStatus(lead.status);
    setNewNote('');
    setNextFollowUpDate('');
    setApprovedCredentials(null);
    setLoadingFollowUps(true);

    try {
      const res = await fetch(`/api/enquiries/${lead.id}/follow-ups`);
      const data = await res.json();
      if (data.success) {
        setFollowUps(data.followUps || []);
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
    } finally {
      setLoadingFollowUps(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedLead) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedStatus(newStatus);
        setSelectedLead({ ...selectedLead, status: newStatus as any });
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedLead.id ? { ...e, status: newStatus as any } : e))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleApproveUser = async () => {
    if (!selectedLead) return;
    setApprovingUser(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_user' })
      });
      const data = await res.json();
      if (data.success) {
        setApprovedCredentials(data.credentials);
        setSelectedStatus('APPROVED');
        setSelectedLead({ ...selectedLead, status: 'APPROVED' as any });
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedLead.id ? { ...e, status: 'APPROVED' as any } : e))
        );

        // Refresh follow-ups
        const fRes = await fetch(`/api/enquiries/${selectedLead.id}/follow-ups`);
        const fData = await fRes.json();
        if (fData.success) {
          setFollowUps(fData.followUps || []);
        }
      }
    } catch (err) {
      console.error('Error approving user:', err);
    } finally {
      setApprovingUser(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedLead.id}/follow-ups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: newNote.trim(),
          nextFollowUpAt: nextFollowUpDate || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setFollowUps([data.followUp, ...followUps]);
        setNewNote('');
        setNextFollowUpDate('');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, email, or corridor..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <a
          href="/api/enquiries/export"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </a>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Visitor / Contact</th>
                <th className="py-3 px-4">Preferred Corridor</th>
                <th className="py-3 px-4">Purpose &amp; Budget</th>
                <th className="py-3 px-4">Visit Date &amp; Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No leads found matching the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => openLeadDetails(lead)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
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
                      <div className="font-semibold text-slate-800">{lead.purpose}</div>
                      <div className="text-[11px] text-slate-500">{lead.budget || 'Standard Range'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-medium text-slate-800">
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
                            : lead.status === 'REJECTED'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeadDetails(lead);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0b4632] hover:text-[#fef9c3] text-slate-700 font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail & Approval Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slideLeft overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50 sticky top-0 z-10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Lead Enquiry #{selectedLead.id.slice(0, 8)}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedLead.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-mono">{selectedLead.phone}</span>
                  {selectedLead.email && <span>· {selectedLead.email}</span>}
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Approval Credentials Alert if just approved */}
              {approvedCredentials && (
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Client Portal Access Granted!</span>
                  </div>
                  <p>Share these credentials with the client to let them access blueprints and documents:</p>
                  <div className="p-2.5 rounded bg-white font-mono text-[11px] border border-emerald-200 space-y-1">
                    <div><strong>Login Email:</strong> {approvedCredentials.email}</div>
                    <div><strong>Password:</strong> {approvedCredentials.password}</div>
                  </div>
                </div>
              )}

              {/* Quick Actions Bar */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedLead.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedLead.name
                  )},%20MKM%20Properties%20here%20regarding%20your%20site%20visit%20request.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {selectedLead.status !== 'APPROVED' ? (
                  <button
                    type="button"
                    onClick={handleApproveUser}
                    disabled={approvingUser}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b4632] hover:bg-[#06281d] text-[#fef9c3] font-bold text-xs cursor-pointer ml-auto disabled:opacity-70"
                  >
                    {approvingUser ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 text-[#c59b27]" />
                    )}
                    <span>Approve User Access</span>
                  </button>
                ) : (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Portal Authorized</span>
                  </span>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Lead Status Transition
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.filter((s) => s.value !== 'ALL').map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleUpdateStatus(opt.value)}
                      disabled={statusUpdating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedStatus === opt.value
                          ? 'bg-[#0b4632] text-[#fef9c3] shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiry Details Grid */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Enquiry Specifics
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Preferred Location</span>
                    <span className="font-bold text-slate-800">{selectedLead.preferredLocation || 'Trichy General'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Property Purpose</span>
                    <span className="font-bold text-slate-800">{selectedLead.purpose}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Visit Date &amp; Time</span>
                    <span className="font-bold text-slate-800">
                      {selectedLead.preferredVisitDate || 'Flexible'} · {selectedLead.preferredTime || 'Any'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Budget</span>
                    <span className="font-bold text-slate-800">{selectedLead.budget || 'Standard'}</span>
                  </div>
                </div>

                {selectedLead.additionalRequirements && (
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs">
                    <span className="text-[10px] text-amber-800 uppercase font-bold block">Customer Requirements:</span>
                    <p className="text-slate-800 mt-1">{selectedLead.additionalRequirements}</p>
                  </div>
                )}
              </div>

              {/* Internal Notes & Follow-ups */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Internal Notes &amp; Follow-up History
                </h3>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note or site visit outcome..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="date"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50"
                      title="Next Follow-up Date"
                    />
                    <button
                      type="submit"
                      disabled={submittingNote || !newNote.trim()}
                      className="btn btn-primary btn-sm text-xs cursor-pointer disabled:opacity-50"
                    >
                      {submittingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Save Note</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {loadingFollowUps ? (
                    <div className="py-4 text-center text-xs text-slate-400">Loading notes...</div>
                  ) : followUps.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-400">No notes recorded yet.</div>
                  ) : (
                    followUps.map((f) => (
                      <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{f.createdBy}</span>
                          <span>{formatDateTime(f.createdAt)}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{f.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
