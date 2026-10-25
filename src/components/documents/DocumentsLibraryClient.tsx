'use client';

import React, { useState } from 'react';
import {
  FileText,
  FolderDown,
  Download,
  Filter,
  Search,
  Building2,
  FileCheck2,
  ShieldCheck,
  BadgePercent
} from 'lucide-react';
import type { DocumentRecord } from '@/lib/db/repository';

interface Props {
  initialDocuments: DocumentRecord[];
}

const CATEGORIES = ['ALL', 'Brochure', 'Layout', 'Legal', 'Price Sheet'];

export default function DocumentsLibraryClient({ initialDocuments }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = initialDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.projectName && doc.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Layout':
        return FileCheck2;
      case 'Legal':
        return ShieldCheck;
      case 'Price Sheet':
        return BadgePercent;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[var(--line-strong)] shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--forest)] text-[#fef9c3]'
                  : 'bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]'
              }`}
            >
              {cat === 'ALL' ? 'All Documents' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ink-soft)]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name or project..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--line-strong)] bg-white text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line-strong)] p-12 text-center bg-white/40">
          <FolderDown className="h-10 w-10 text-[var(--ink-soft)] mx-auto mb-3 opacity-60" />
          <h3 className="f-display text-lg font-bold text-[var(--ink)]">No Documents Found</h3>
          <p className="text-xs text-[var(--ink-soft)] mt-1">
            Try choosing a different category or clearing your search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const Icon = getCategoryIcon(doc.category);
            return (
              <div
                key={doc.id}
                className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs flex flex-col justify-between hover:border-[var(--forest)] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--paper-2)] px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--forest)]">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{doc.category}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[var(--ink-soft)]">
                      {doc.fileSize || 'PDF'}
                    </span>
                  </div>

                  <h3 className="f-display text-lg font-bold text-[var(--ink)] group-hover:text-[var(--forest)] transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  {doc.projectName && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--gold)] font-medium mt-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{doc.projectName}</span>
                    </div>
                  )}

                  {doc.description && (
                    <p className="text-xs text-[var(--ink-soft)] mt-3 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>

                  <a
                    href={`/api/documents/${doc.id}/download`}
                    className="btn btn-outline btn-sm !py-1.5 !px-3 text-xs inline-flex items-center gap-1.5 font-bold"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
