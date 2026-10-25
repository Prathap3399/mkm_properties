'use client';

import React, { useState } from 'react';
import {
  FolderDown,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  Download,
  Building2,
  FileCheck2,
  ShieldCheck,
  BadgePercent,
  FileText,
  X,
  Loader2
} from 'lucide-react';
import type { DocumentRecord, ProjectRecord } from '@/lib/db/repository';

interface Props {
  initialDocuments: DocumentRecord[];
  projects: ProjectRecord[];
}

const CATEGORIES = ['Brochure', 'Layout', 'Approval', 'Legal', 'Price Sheet'];

export default function DocumentsManagerClient({ initialDocuments, projects }: Props) {
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Brochure');
  const [fileUrl, setFileUrl] = useState('/brochures/mkm-sterling-avenue-brochure.pdf');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [projectId, setProjectId] = useState<string>('');

  const filtered = documents.filter((doc) => {
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.projectName && doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingDoc) {
        // Edit existing
        const res = await fetch(`/api/admin/documents/${editingDoc.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category,
            fileUrl: fileUrl.trim(),
            fileSize: fileSize.trim(),
            projectId: projectId || null
          })
        });
        const data = await res.json();
        if (data.success && data.document) {
          setDocuments((prev) =>
            prev.map((d) => (d.id === editingDoc.id ? data.document : d))
          );
          setEditingDoc(null);
        }
      } else {
        // Create new
        const res = await fetch('/api/admin/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category,
            fileUrl: fileUrl.trim(),
            fileSize: fileSize.trim(),
            projectId: projectId || null,
            isProtected: 1
          })
        });
        const data = await res.json();
        if (data.success && data.document) {
          setDocuments([data.document, ...documents]);
          setShowAddModal(false);
          setTitle('');
          setDescription('');
        }
      }
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (docId: string, docTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${docTitle}"?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/documents/${docId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (doc: DocumentRecord) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setDescription(doc.description || '');
    setCategory(doc.category);
    setFileUrl(doc.fileUrl);
    setFileSize(doc.fileSize || '1.5 MB');
    setProjectId(doc.projectId || '');
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
              placeholder="Search documents by title or project..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b4632]"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingDoc(null);
            setTitle('');
            setDescription('');
            setCategory('Brochure');
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b4632] hover:bg-[#06281d] text-[#fef9c3] font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#c59b27]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Title / Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Associated Project</th>
                <th className="py-3 px-4">File Details</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No documents found.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 leading-snug">{doc.title}</div>
                      {doc.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {doc.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {doc.projectName || 'General / All Layouts'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {doc.fileSize || 'PDF'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <a
                        href={`/api/documents/${doc.id}/download`}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => startEdit(doc)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center cursor-pointer"
                        title="Edit metadata"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-red-50 text-red-600 inline-flex items-center cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingDoc) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingDoc ? 'Edit Document' : 'Upload / Add Document'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDoc(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sterling Avenue — Official DTCP Layout Blueprint"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about plot numbers, road widths, and survey markings..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associated Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                  >
                    <option value="">General (No Specific Project)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File URL / Local Path</label>
                  <input
                    type="text"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="/brochures/filename.pdf"
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Size Label</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="1.5 MB"
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDoc(null);
                  }}
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
                  <span>{editingDoc ? 'Update Document' : 'Save Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
