'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Eye, CheckCircle2, XCircle, Trash2, Edit, ExternalLink, ShieldCheck } from 'lucide-react';
import type { ProjectRecord } from '@/lib/db/repository';

export default function ProjectsManagerClient({ initialProjects }: { initialProjects: ProjectRecord[] }) {
  const [projects, setProjects] = useState<ProjectRecord[]>(initialProjects);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const togglePublish = async (project: ProjectRecord) => {
    setUpdatingId(project.id);
    const newStatus = project.isPublished === 1 ? 0 : 1;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, isPublished: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Total Inventory: {projects.length} Projects
        </span>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b4632] text-[#fef9c3] hover:bg-[#06281d] font-bold text-xs transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-[#c59b27]" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Cover</th>
                <th className="px-6 py-3.5">Project Name</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Price & Availability</th>
                <th className="px-6 py-3.5">Approval Status</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={project.coverImageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <Link href={`/projects/${project.slug}`} target="_blank" className="hover:underline flex items-center gap-1">
                      <span>{project.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    <span className="block text-[11px] font-normal text-slate-400">/{project.slug}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {project.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#0b4632] block">
                      {project.priceLabel || 'On Request'}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {project.availabilityStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.approvalStatus ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#c59b27]" />
                        {project.approvalStatus}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unspecified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(project)}
                      disabled={updatingId === project.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        project.isPublished === 1
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {project.isPublished === 1 ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="p-1.5 text-slate-500 hover:text-slate-900 inline-block"
                      title="Preview live page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      className="p-1.5 text-red-500 hover:text-red-700 inline-block cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
