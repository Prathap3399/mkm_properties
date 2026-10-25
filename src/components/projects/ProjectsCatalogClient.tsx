'use client';

import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import type { ProjectRecord } from '@/lib/db/repository';
import { Search, ShieldCheck, MapPin } from 'lucide-react';

export default function ProjectsCatalogClient({ initialProjects }: { initialProjects: ProjectRecord[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = initialProjects.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || p.availabilityStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Search and filters */}
      <div className="flex flex-col items-stretch justify-between gap-5 border-y-2 border-[var(--ink)] py-5 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search project or corridor (e.g. Panjappur)"
            aria-label="Search projects"
            className="field !pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Available', 'Coming Soon', 'Sold Out'].map((status) => {
            const active = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                aria-pressed={active}
                className={`f-mono border px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  active
                    ? 'border-[var(--forest)] bg-[var(--forest)] text-[var(--gold-soft)]'
                    : 'border-[var(--line-strong)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--forest)] hover:text-[var(--forest)]'
                }`}
              >
                {status === 'ALL' ? 'All Layouts' : status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results meta */}
      <div className="f-mono flex flex-col justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-soft)] sm:flex-row sm:items-center">
        <span>
          Showing <strong className="text-[var(--ink)]">{filtered.length}</strong> of {initialProjects.length} verified layouts
        </span>
        <span className="flex items-center gap-1.5 text-[var(--forest)]">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--gold)]" />
          Direct owner pricing &amp; legal verification
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="plan-card grid-paper px-6 py-16 text-center">
          <MapPin className="mx-auto h-10 w-10 text-[var(--gold)]" strokeWidth={1.5} />
          <h3 className="f-display mt-4 text-2xl font-medium">No layouts matching your search</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--ink-soft)]">
            Try adjusting your keyword or reset filters to explore all available projects in Trichy.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
            }}
            className="btn btn-primary btn-sm mt-6"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
