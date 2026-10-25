'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  UserX,
  KeyRound,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Lock,
  Phone,
  Mail
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { UserRecord } from '@/lib/db/repository';

interface Props {
  initialUsers: UserRecord[];
}

export default function UsersManagerClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserRecord | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [newUserPass, setNewUserPass] = useState('MKMClient@2026!');
  const [createError, setCreateError] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus as any } : u))
        );
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser || !newPassword.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${resetPasswordUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword.trim() })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Password for ${resetPasswordUser.email} has been updated.`);
        setResetPasswordUser(null);
        setNewPassword('');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${email}"?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          phone: newPhone.trim(),
          password: newUserPass,
          role: newRole,
          status: 'APPROVED'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers([data.user, ...users]);
        setShowCreateModal(false);
        setNewName('');
        setNewEmail('');
        setNewPhone('');
      } else {
        setCreateError(data.error || 'Failed to create user');
      }
    } catch (err: any) {
      setCreateError('Error creating user account');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
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
              placeholder="Search users by name, email, or mobile..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved (Authorized)</option>
            <option value="PENDING">Pending Approval</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b4632] hover:bg-[#06281d] text-[#fef9c3] font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#c59b27]" />
          <span>Create User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">User / Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {user.id.slice(0, 8)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{user.email}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{user.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          user.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : user.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {user.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                        {user.status === 'PENDING' && <Lock className="w-3 h-3 text-amber-700" />}
                        {user.status === 'DISABLED' && <UserX className="w-3 h-3 text-red-700" />}
                        <span>{user.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {user.status !== 'APPROVED' ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user.id, 'APPROVED')}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] cursor-pointer"
                          title="Approve access"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user.id, 'DISABLED')}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-amber-100 text-amber-900 font-bold text-[11px] cursor-pointer"
                          title="Disable access"
                        >
                          Disable
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setResetPasswordUser(user);
                          setNewPassword('');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                        title="Reset password"
                      >
                        Reset PW
                      </button>

                      {user.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={actionLoading}
                          className="p-1 rounded text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Create Authorized User</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. S. Suresh Kumar"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="suresh@example.com"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="9840123456"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
                  >
                    <option value="user">User (Client)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default Password</label>
                  <input
                    type="text"
                    required
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-primary btn-sm"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save &amp; Authorize</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                Reset Password for {resetPasswordUser.name}
              </h3>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newPassword.trim()}
                  className="btn btn-primary btn-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
